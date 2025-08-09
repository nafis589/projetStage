import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Upload, X, File, Image, Video, FileText, Archive, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  acceptedTypes?: string[];
  maxFileSize?: number; // en MB
  maxFiles?: number;
  allowMultiple?: boolean;
  className?: string;
}

interface UploadedFile {
  file: File;
  id: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
}

const FileUploadWithAPI: React.FC<FileUploadProps> = ({
  acceptedTypes = ['*'],
  maxFileSize = 10,
  maxFiles = 5,
  allowMultiple = true,
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptString = useMemo(() => {
    if (acceptedTypes.includes('*')) return '';
    return acceptedTypes.join(',');
  }, [acceptedTypes]);

  const getFileIcon = useCallback((fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) {
      return <Image className="w-6 h-6 text-blue-500" aria-label='Image file' />;
    }
    if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(ext || '')) {
      return <Video className="w-6 h-6 text-purple-500" />;
    }
    if (['pdf', 'doc', 'docx', 'txt'].includes(ext || '')) {
      return <FileText className="w-6 h-6 text-red-500" />;
    }
    if (['zip', 'rar', '7z'].includes(ext || '')) {
      return <Archive className="w-6 h-6 text-yellow-500" />;
    }
    return <File className="w-6 h-6 text-gray-500" />;
  }, []);

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const validateFile = useCallback((file: File) => {
    if (!acceptedTypes.includes('*')) {
      const fileType = file.type;
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const isTypeValid = acceptedTypes.some(type =>
        fileType.includes(type.replace('*', '')) ||
        type === fileExtension
      );
      if (!isTypeValid) {
        return `Type de fichier non accepté: ${file.name}`;
      }
    }
    if (file.size > maxFileSize * 1024 * 1024) {
      return `Fichier trop volumineux: ${file.name} (max ${maxFileSize}MB)`;
    }
    return null;
  }, [acceptedTypes, maxFileSize]);

  const uploadFile = useCallback(async (file: File, fileId: string) => {
    try {
      const formData = new FormData();
      formData.append('files', file);

      const response = await fetch('/api/upload/documents', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const rawText = await response.text();
        let errorMessage = rawText;
        try {
          const parsed = JSON.parse(rawText);
          if (parsed?.error) {
            errorMessage = parsed.error;
          }
        } catch {
          // pas du JSON, on garde rawText
        }

        console.error('Upload error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage,
          raw: rawText,
        });

        throw new Error(errorMessage || 'Erreur lors de l\'upload');
      }

      await response.json();

      setUploadedFiles(prev =>
        prev.map(f => f.id === fileId ? { ...f, status: 'success', progress: 100 } : f)
      );
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadedFiles(prev =>
        prev.map(f => f.id === fileId ? { ...f, status: 'error', progress: 100 } : f)
      );
    }
  }, []);

  const handleFiles = useCallback((files: FileList) => {
    setError('');
    const fileArray = Array.from(files);

    if (!allowMultiple && fileArray.length > 1) {
      setError('Un seul fichier autorisé');
      return;
    }

    if (uploadedFiles.length + fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} fichiers autorisés`);
      return;
    }

    const validFiles: File[] = [];
    for (const file of fileArray) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      validFiles.push(file);
    }

    const newUploadedFiles: UploadedFile[] = validFiles.map(file => ({
      file,
      id: `${Date.now()}-${Math.random()}`,
      status: 'uploading',
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newUploadedFiles]);

    newUploadedFiles.forEach(({ file, id }) => uploadFile(file, id));
  }, [allowMultiple, uploadedFiles.length, maxFiles, validateFile, uploadFile]);

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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const removeFile = useCallback((id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      {/* Zone de drop */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ease-in-out
          ${dragActive ? 'border-blue-400 bg-blue-50 scale-105'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
          ${uploadedFiles.length > 0 ? 'mb-6' : ''}
        `}
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
        <div className={`transition-all duration-200 ${dragActive ? 'scale-110' : ''}`}>
          <div className="mb-4">
            <Upload className={`w-12 h-12 mx-auto ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
          </div>
          <p className="text-lg font-medium text-gray-700">
            Glissez vos fichiers ici ou <span className="text-blue-500 underline cursor-pointer">parcourez</span>
          </p>
          <div className="text-sm text-gray-500 space-y-1">
            <p>
              {acceptedTypes.includes('*')
                ? 'Tous types de fichiers acceptés'
                : `Types acceptés: ${acceptedTypes.join(', ')}`}
            </p>
            <p>Taille max: {maxFileSize}MB • Max {maxFiles} fichier{maxFiles > 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Liste des fichiers */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-800">
            Fichiers ({uploadedFiles.length}/{maxFiles})
          </h3>
          {uploadedFiles.map(uploadedFile => (
            <div key={uploadedFile.id} className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getFileIcon(uploadedFile.file.name)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{uploadedFile.file.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(uploadedFile.file.size)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {uploadedFile.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {uploadedFile.status === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                  <button onClick={() => removeFile(uploadedFile.id)} className="p-1 text-gray-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ease-out ${
                    uploadedFile.status === 'error'
                      ? 'bg-red-500'
                      : uploadedFile.status === 'success'
                      ? 'bg-green-500'
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${uploadedFile.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadWithAPI;
