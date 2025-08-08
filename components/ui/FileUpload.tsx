import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Upload, X, File, Image, Video, FileText, Archive, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFilesSelected?: (files: File[]) => void;
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

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
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
      return <Image className="w-6 h-6 text-blue-500" />;
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

  const simulateUpload = useCallback((fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadedFiles(prev => 
          prev.map(f => f.id === fileId 
            ? { ...f, status: 'success' as const, progress: 100 }
            : f
          )
        );
      } else {
        setUploadedFiles(prev => 
          prev.map(f => f.id === fileId 
            ? { ...f, progress }
            : f
          )
        );
      }
    }, 100);
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
    newUploadedFiles.forEach(({ id }) => simulateUpload(id));
    
    onFilesSelected?.(validFiles);
  }, [allowMultiple, uploadedFiles.length, maxFiles, validateFile, simulateUpload, onFilesSelected]);

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
          ${dragActive 
            ? 'border-blue-400 bg-blue-50 scale-105' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
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
            <Upload className={`w-12 h-12 mx-auto transition-colors duration-200 ${
              dragActive ? 'text-blue-500' : 'text-gray-400'
            }`} />
          </div>
          
          <div className="mb-2">
            <p className="text-lg font-medium text-gray-700">
              Glissez vos fichiers ici ou <span className="text-blue-500 underline cursor-pointer">parcourez</span>
            </p>
          </div>
          
          <div className="text-sm text-gray-500 space-y-1">
            <p>
              {acceptedTypes.includes('*') 
                ? 'Tous types de fichiers acceptés' 
                : `Types acceptés: ${acceptedTypes.join(', ')}`
              }
            </p>
            <p>Taille max: {maxFileSize}MB • Max {maxFiles} fichier{maxFiles > 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Liste des fichiers uploadés */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-800">
            Fichiers ({uploadedFiles.length}/{maxFiles})
          </h3>
          
          {uploadedFiles.map((uploadedFile) => (
            <div
              key={uploadedFile.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getFileIcon(uploadedFile.file.name)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(uploadedFile.file.size)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  {uploadedFile.status === 'success' && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {uploadedFile.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  <button
                    onClick={() => removeFile(uploadedFile.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                    title="Supprimer le fichier"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Barre de progression */}
              {uploadedFile.status === 'uploading' && (
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300 ease-out"
                    style={{ width: `${uploadedFile.progress}%` }}
                  />
                </div>
              )}
              
              {uploadedFile.status === 'success' && (
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div className="h-full bg-green-500 w-full rounded-full" />
                </div>
              )}
              
              {uploadedFile.status === 'error' && (
                <div className="w-full bg-red-200 rounded-full h-2">
                  <div className="h-full bg-red-500 w-full rounded-full" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;