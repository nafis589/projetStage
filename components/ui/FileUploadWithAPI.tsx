import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Upload,
  X,
  File as FileIcon,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  Archive,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

type Status = "pending" | "uploading" | "success" | "error";

export interface UploadedFileInfo {
  id: number;
  filename: string;
  originalName: string;
  size: number;
  type: string;
  documentType: string;
  path: string;
}

interface FileWithStatus {
  file: File;
  id: string;
  status: Status;
  progress: number; // 0-100
  error?: string;
  uploadedInfo?: UploadedFileInfo | null;
}

interface FileUploadProps {
  onFilesUploaded?: (files: UploadedFileInfo[]) => void;
  acceptedTypes?: string[]; // ex: ['.pdf', '.docx', '.jpg'] or ['*'] to allow all
  maxFileSizeMB?: number; // default 5 (MB) — keep in sync with backend limit
  maxFiles?: number;
  allowMultiple?: boolean;
  concurrency?: number; // nombre max d'uploads en parallèle
  className?: string;
  uploadUrl?: string; // default '/api/upload/documents'
  deleteUrl?: (id: number) => string; // fonction pour créer l'URL de delete
}

const DEFAULT_UPLOAD_URL = "/api/upload/documents";

const FileUploadWithAPI: React.FC<FileUploadProps> = ({
  onFilesUploaded,
  acceptedTypes = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"],
  maxFileSizeMB = 5,
  maxFiles = 5,
  allowMultiple = true,
  concurrency = 3,
  className = "",
  uploadUrl = DEFAULT_UPLOAD_URL,
  deleteUrl = (id) => `${DEFAULT_UPLOAD_URL}?id=${id}`,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const acceptString = useMemo(() => {
    if (acceptedTypes.includes("*")) return "";
    return acceptedTypes.join(",");
  }, [acceptedTypes]);

  // --- UI Helpers ---
  const getFileIcon = useCallback((fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext || ""))
      return <ImageIcon className="w-6 h-6" />;
    if (["mp4", "avi", "mov", "wmv", "flv"].includes(ext || ""))
      return <VideoIcon className="w-6 h-6" />;
    if (["pdf", "doc", "docx", "txt"].includes(ext || "")) return <FileText className="w-6 h-6" />;
    if (["zip", "rar", "7z"].includes(ext || "")) return <Archive className="w-6 h-6" />;
    return <FileIcon className="w-6 h-6" />;
  }, []);

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }, []);

  // --- Validation client-side (extension + size) ---
  const validateFile = useCallback(
    (file: File) => {
      if (!acceptedTypes.includes("*")) {
        const extension = "." + (file.name.split(".").pop() || "").toLowerCase();
        if (!acceptedTypes.includes(extension)) {
          return `Type de fichier non accepté: ${file.name}`;
        }
      }
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        return `Fichier trop volumineux: ${file.name} (max ${maxFileSizeMB}MB)`;
      }
      return null;
    },
    [acceptedTypes, maxFileSizeMB]
  );

  // --- Upload with XHR for progress events ---
  const uploadSingleFile = useCallback(
    (fileWithStatus: FileWithStatus): Promise<UploadedFileInfo | null> => {
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        const fd = new FormData();
        // IMPORTANT: backend expects "files" (formData.getAll("files"))
        fd.append("files", fileWithStatus.file);

        xhr.open("POST", uploadUrl, true);
        // include credentials like you had with fetch
        xhr.withCredentials = true;

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            setFiles((prev) =>
              prev.map((f) => (f.id === fileWithStatus.id ? { ...f, progress: percent } : f))
            );
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText || "{}");
              // sécurité : vérifie si res.files existe et contient un élément
              const uploaded = Array.isArray(res.files) && res.files.length > 0 ? res.files[0] : null;
              if (uploaded) {
                setFiles((prev) =>
                  prev.map((f) =>
                    f.id === fileWithStatus.id ? { ...f, status: "success", progress: 100, uploadedInfo: uploaded } : f
                  )
                );
                resolve(uploaded);
                return;
              } else {
                const message = res?.error || "Réponse inattendue du serveur";
                setFiles((prev) =>
                  prev.map((f) =>
                    f.id === fileWithStatus.id ? { ...f, status: "error", progress: 0, error: message } : f
                  )
                );
                resolve(null);
                return;
              }
            } catch {
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === fileWithStatus.id
                    ? { ...f, status: "error", progress: 0, error: "Impossible de parser la réponse serveur" }
                    : f
                )
              );
              resolve(null);
              return;
            }
          } else {
            // essaie de parser message d'erreur JSON, sinon utiliser responseText
            let parsedError = "";
            try {
              const parsed = JSON.parse(xhr.responseText || "{}");
              parsedError = parsed?.error || JSON.stringify(parsed);
            } catch {
              parsedError = xhr.responseText || `HTTP ${xhr.status}`;
            }
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileWithStatus.id ? { ...f, status: "error", progress: 0, error: parsedError } : f
              )
            );
            resolve(null);
          }
        };

        xhr.onerror = () => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileWithStatus.id ? { ...f, status: "error", progress: 0, error: "Erreur réseau" } : f
            )
          );
          resolve(null);
        };

        // set status to uploading
        setFiles((prev) => prev.map((f) => (f.id === fileWithStatus.id ? { ...f, status: "uploading", progress: 0, error: undefined } : f)));

        xhr.send(fd);
      });
    },
    [uploadUrl]
  );

  // --- Concurrency-limited runner ---
  const runWithConcurrency = useCallback(
    async (toUpload: FileWithStatus[]) => {
      const results: (UploadedFileInfo | null)[] = [];
      const queue = [...toUpload];
      const workers: Promise<void>[] = [];

      const worker = async () => {
        while (queue.length > 0) {
          const item = queue.shift();
          if (!item) break;
          const uploaded = await uploadSingleFile(item);
          results.push(uploaded);
        }
      };

      for (let i = 0; i < Math.max(1, Math.min(concurrency, toUpload.length)); i++) {
        workers.push(worker());
      }

      await Promise.all(workers);
      return results;
    },
    [concurrency, uploadSingleFile]
  );

  // --- Handle a FileList dropped/selected ---
  const handleFiles = useCallback(
    async (fileList: FileList) => {
      setError("");
      const arr = Array.from(fileList);

      if (!allowMultiple && arr.length > 1) {
        setError("Un seul fichier autorisé");
        return;
      }

      if (files.length + arr.length > maxFiles) {
        setError(`Maximum ${maxFiles} fichiers autorisés`);
        return;
      }

      // validate all
      for (const f of arr) {
        const v = validateFile(f);
        if (v) {
          setError(v);
          return;
        }
      }

      // add to local state as pending
      const newItems: FileWithStatus[] = arr.map((f) => ({
        file: f,
        id: `${Date.now()}-${Math.random()}`,
        status: "pending",
        progress: 0,
        uploadedInfo: null,
      }));

      setFiles((prev) => [...prev, ...newItems]);

      // launch uploads with concurrency limit
      const uploadedInfos = await runWithConcurrency(newItems);

      // collect successful results
      const successful = uploadedInfos.filter(Boolean) as UploadedFileInfo[];

      if (successful.length > 0 && onFilesUploaded) {
        onFilesUploaded(successful);
      }
    },
    [allowMultiple, files.length, maxFiles, validateFile, onFilesUploaded, runWithConcurrency]
  );

  // --- Drag & drop handlers ---
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  // --- Remove file (local + attempt server delete if uploaded) ---
  const removeFile = useCallback(
    async (id: string) => {
      const target = files.find((f) => f.id === id);
      if (!target) return;

      if (target.uploadedInfo?.id) {
        try {
          await fetch(deleteUrl(target.uploadedInfo.id), { method: "DELETE", credentials: "include" });
        } catch {
          // On ne bloque pas l'action côté client
        }
      }

      setFiles((prev) => prev.filter((f) => f.id !== id));
    },
    [files, deleteUrl]
  );

  // --- Retry upload for a specific item ---
  const retryUpload = useCallback(
    async (id: string) => {
      const item = files.find((f) => f.id === id);
      if (!item) return;
      // set back to pending then run uploadSingleFile
      setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: "pending", progress: 0, error: undefined } : f)));
      const res = await uploadSingleFile({ ...item, status: "pending", progress: 0 });
      if (res && onFilesUploaded) {
        onFilesUploaded([res]);
      }
    },
    [files, uploadSingleFile, onFilesUploaded]
  );

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const successfulUploads = files.filter((f) => f.status === "success").length;

  // --- Render ---
  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ease-in-out
          ${dragActive ? "border-blue-400 bg-blue-50 scale-105" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"}
          ${files.length > 0 ? "mb-6" : ""}`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={allowMultiple}
          accept={acceptString}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />

        <div className={`transition-all duration-200 ${dragActive ? "scale-110" : ""}`}>
          <div className="mb-4">
            <Upload className={`w-12 h-12 mx-auto ${dragActive ? "text-blue-500" : "text-gray-400"}`} />
          </div>
          <p className="text-lg font-medium text-gray-700">
            Glissez vos fichiers ici ou <span className="text-blue-500 underline cursor-pointer">parcourez</span>
          </p>
          <div className="text-sm text-gray-500 space-y-1">
            <p>{acceptedTypes.includes("*") ? "Tous types de fichiers acceptés" : `Types acceptés: ${acceptedTypes.join(", ")}`}</p>
            <p>Taille max: {maxFileSizeMB}MB • Max {maxFiles} fichier{maxFiles > 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {files.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700 text-sm text-center">
            {successfulUploads} / {files.length} fichier(s) uploadé(s) avec succès
          </p>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-800">Fichiers ({files.length}/{maxFiles})</h3>

          {files.map((f) => (
            <div key={f.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getFileIcon(f.file.name)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{f.file.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(f.file.size)}
                      {f.uploadedInfo && <span className="ml-2 text-green-600">• {f.uploadedInfo.documentType}</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {f.status === "uploading" && <Loader2 className="w-5 h-5 animate-spin" />}
                  {f.status === "success" && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {f.status === "error" && (
                    <div className="flex items-center gap-1">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <button onClick={() => retryUpload(f.id)} className="text-xs text-blue-500 hover:text-blue-700">
                        Réessayer
                      </button>
                    </div>
                  )}
                  <button onClick={() => removeFile(f.id)} className="p-1 text-gray-400 hover:text-red-500" title="Supprimer le fichier">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                {f.status === "uploading" && (
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-300 ease-out" style={{ width: `${f.progress}%` }} />
                  </div>
                )}

                {f.status === "success" && (
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div className="h-full bg-green-500 w-full rounded-full" />
                  </div>
                )}

                {f.status === "error" && (
                  <div className="space-y-2">
                    <div className="w-full bg-red-200 rounded-full h-2">
                      <div className="h-full bg-red-500 w-full rounded-full" />
                    </div>
                    {f.error && <p className="text-red-600 text-xs">{f.error}</p>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadWithAPI;
