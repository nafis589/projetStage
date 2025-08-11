import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { getToken } from "next-auth/jwt";
import util from "util";
import db from "@/util/db";
import {
  generateUniqueFilename,
  determineDocumentType,
  isValidFileType,
  isValidFileSize
} from "@/lib/documentUtils";
import { put, del as blobDelete } from "@vercel/blob";

const query = util.promisify(db.query).bind(db);

export async function POST(request) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ error: "Configuration manquante: BLOB_READ_WRITE_TOKEN" }, { status: 500 });
    }
    // Authentification avec NextAuth
    const token = await getToken({
      req: request, // ✅ On passe l'objet NextRequest directement
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!token?.userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const formData = await request.formData();
    // ⚠ Ici, le front envoie "files" (FormData.getAll("files"))
    const files = formData.getAll("files");

    if (!files.length) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    const uploadedFiles = [];

    for (const file of files) {
      if (!file || file.size === 0) continue;

      if (!isValidFileType(file.type)) {
        return NextResponse.json(
          { error: `Type de fichier non autorisé: ${file.name}` },
          { status: 400 }
        );
      }

      if (!isValidFileSize(file.size, 5)) {
        return NextResponse.json(
          { error: `Fichier trop volumineux: ${file.name}` },
          { status: 400 }
        );
      }

      // Upload vers Vercel Blob (public)
      const uniqueFilename = generateUniqueFilename(file.name);
      const blobRes = await put(uniqueFilename, file, {
        access: "public",
        addRandomSuffix: true,
        contentType: file.type,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      const documentType = determineDocumentType(file.name);

      const result = await query(
        `INSERT INTO professional_documents 
         (user_id, filename, original_filename, file_path, file_size, file_type, document_type) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          token.userId,
          (blobRes.pathname || uniqueFilename).split("/").pop(),
          file.name,
          blobRes.url,
          file.size,
          file.type,
          documentType
        ]
      );

      uploadedFiles.push({
        id: result.insertId,
        filename: (blobRes.pathname || uniqueFilename).split("/").pop(),
        originalName: file.name,
        size: file.size,
        type: file.type,
        documentType,
        path: blobRes.url
      });
    }

    return NextResponse.json(
      { message: "Fichiers uploadés avec succès", files: uploadedFiles },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    return NextResponse.json({ error: "Erreur serveur lors de l'upload" }, { status: 500 });
  }
}

// GET /api/upload/documents?userId=123
// - Un utilisateur non admin ne peut récupérer que ses propres documents (userId ignoré)
// - Un admin peut récupérer les documents de n'importe quel utilisateur via userId
export async function GET(request) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get("userId") || searchParams.get("user_id");

    let targetUserId = Number(token.userId);
    if (token.role === "admin" && userIdParam) {
      targetUserId = Number(userIdParam);
    }

    const rows = await query(
      `SELECT id, user_id, filename, original_filename, file_path, file_size, file_type, document_type, upload_date, is_verified
       FROM professional_documents
       WHERE user_id = ?
       ORDER BY upload_date DESC`,
      [targetUserId]
    );

    const files = rows.map((r) => ({
      id: r.id,
      filename: r.filename,
      originalName: r.original_filename,
      size: r.file_size,
      type: r.file_type,
      documentType: r.document_type,
      path: r.file_path,
      uploadDate: r.upload_date,
      isVerified: !!r.is_verified,
    }));

    return NextResponse.json({ files }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des documents:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/upload/documents?id=45
// - Un utilisateur non admin ne peut supprimer que ses propres documents
// - Un admin peut supprimer n'importe quel document
export async function DELETE(request) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Paramètre id manquant" }, { status: 400 });
    }

    const rows = await query(`SELECT * FROM professional_documents WHERE id = ?`, [id]);
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "Document introuvable" }, { status: 404 });
    }

    const doc = rows[0];
    if (token.role !== "admin" && Number(doc.user_id) !== Number(token.userId)) {
      return NextResponse.json({ error: "Interdit" }, { status: 403 });
    }

    // Supprimer le fichier depuis Vercel Blob si l'URL est distante, sinon best-effort local
    const filePathValue = typeof doc.file_path === "string" ? doc.file_path : "";
    if (/^https?:\/\//i.test(filePathValue)) {
      try {
        await blobDelete(filePathValue, { token: process.env.BLOB_READ_WRITE_TOKEN });
      } catch {
        // Ignorer les erreurs de suppression distante
      }
    } else {
      try {
        const rel = filePathValue.replace(/^\\|^\//, "");
        const abs = path.join(process.cwd(), "public", rel);
        await unlink(abs);
      } catch {
        // Ignorer si fichier déjà supprimé
      }
    }

    await query(`DELETE FROM professional_documents WHERE id = ?`, [id]);

    return NextResponse.json({ success: true, message: "Document supprimé" }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la suppression du document:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}