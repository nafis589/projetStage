import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
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

const query = util.promisify(db.query).bind(db);

export async function POST(request) {
  try {
    // Authentification avec NextAuth
    const token = await getToken({
      req: request, // ✅ On passe l'objet NextRequest directement
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!token?.userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const formData = await request.formData();
    // ⚠ Ici, le front envoie "file" et non "files" → à aligner
    const files = formData.getAll("files");

    if (!files.length) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    const uploadedFiles = [];
    const uploadDir = path.join(process.cwd(), "public/uploads/documents");
    await mkdir(uploadDir, { recursive: true });

    for (const file of files) {
      if (file.size === 0) continue;

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

      const uniqueFilename = generateUniqueFilename(file.name);
      const filePath = path.join(uploadDir, uniqueFilename);
      const relativePath = `/uploads/documents/${uniqueFilename}`;

      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);

      const documentType = determineDocumentType(file.name);

      const result = await query(
        `INSERT INTO professional_documents 
         (user_id, filename, original_filename, file_path, file_size, file_type, document_type) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          token.userId,
          uniqueFilename,
          file.name,
          relativePath,
          file.size,
          file.type,
          documentType
        ]
      );

      uploadedFiles.push({
        id: result.insertId,
        filename: uniqueFilename,
        originalName: file.name,
        size: file.size,
        type: file.type,
        documentType,
        path: relativePath
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
