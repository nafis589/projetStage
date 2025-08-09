import path from 'path';
import { unlink, access } from 'fs/promises';

/**
 * Utilitaires pour la gestion des documents uploadés
 */

/**
 * Génère un nom de fichier unique
 * @param {string} originalName - Nom original du fichier
 * @returns {string} Nom de fichier unique
 */
export function generateUniqueFilename(originalName) {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileExtension = path.extname(originalName);
  return `${timestamp}_${randomString}${fileExtension}`;
}

/**
 * Détermine le type de document basé sur le nom du fichier
 * @param {string} filename - Nom du fichier
 * @returns {string} Type de document (cv, certification, identity, other)
 */
export function determineDocumentType(filename) {
  const lowerFilename = filename.toLowerCase();
  
  if (lowerFilename.includes('cv') || lowerFilename.includes('resume')) {
    return 'cv';
  }
  
  if (lowerFilename.includes('cert') || lowerFilename.includes('diplom') || 
      lowerFilename.includes('certificate') || lowerFilename.includes('diploma')) {
    return 'certification';
  }
  
  if (lowerFilename.includes('id') || lowerFilename.includes('carte') || 
      lowerFilename.includes('passeport') || lowerFilename.includes('passport') ||
      lowerFilename.includes('identity')) {
    return 'identity';
  }
  
  return 'other';
}

/**
 * Valide le type MIME d'un fichier
 * @param {string} mimeType - Type MIME du fichier
 * @returns {boolean} True si le type est autorisé
 */
export function isValidFileType(mimeType) {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ];
  
  return allowedTypes.includes(mimeType);
}

/**
 * Valide la taille d'un fichier
 * @param {number} fileSize - Taille du fichier en bytes
 * @param {number} maxSizeMB - Taille maximale en MB (défaut: 5)
 * @returns {boolean} True si la taille est acceptable
 */
export function isValidFileSize(fileSize, maxSizeMB = 5) {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return fileSize <= maxSizeBytes;
}

/**
 * Supprime un fichier du système de fichiers
 * @param {string} filePath - Chemin vers le fichier
 * @returns {Promise<boolean>} True si supprimé avec succès
 */
export async function deleteFile(filePath) {
  try {
    const fullPath = path.join(process.cwd(), 'public', filePath);
    await access(fullPath); // Vérifier que le fichier existe
    await unlink(fullPath);
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression du fichier:', error);
    return false;
  }
}

/**
 * Formate la taille d'un fichier en format lisible
 * @param {number} bytes - Taille en bytes
 * @returns {string} Taille formatée (ex: "1.5 MB")
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Obtient l'extension d'un fichier
 * @param {string} filename - Nom du fichier
 * @returns {string} Extension du fichier (avec le point)
 */
export function getFileExtension(filename) {
  return path.extname(filename).toLowerCase();
}

/**
 * Vérifie si un fichier est une image
 * @param {string} mimeType - Type MIME du fichier
 * @returns {boolean} True si c'est une image
 */
export function isImageFile(mimeType) {
  return mimeType.startsWith('image/');
}

/**
 * Vérifie si un fichier est un PDF
 * @param {string} mimeType - Type MIME du fichier
 * @returns {boolean} True si c'est un PDF
 */
export function isPDFFile(mimeType) {
  return mimeType === 'application/pdf';
}

/**
 * Vérifie si un fichier est un document Word
 * @param {string} mimeType - Type MIME du fichier
 * @returns {boolean} True si c'est un document Word
 */
export function isWordDocument(mimeType) {
  return mimeType === 'application/msword' || 
         mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
}

/**
 * Nettoie le nom d'un fichier pour éviter les caractères problématiques
 * @param {string} filename - Nom du fichier
 * @returns {string} Nom nettoyé
 */
export function sanitizeFilename(filename) {
  // Remplacer les caractères spéciaux par des underscores
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
}

/**
 * Crée un résumé des informations d'un fichier
 * @param {Object} file - Objet fichier
 * @returns {Object} Résumé des informations
 */
export function createFileSummary(file) {
  return {
    name: file.name,
    size: formatFileSize(file.size),
    type: file.type,
    extension: getFileExtension(file.name),
    documentType: determineDocumentType(file.name),
    isImage: isImageFile(file.type),
    isPDF: isPDFFile(file.type),
    isWord: isWordDocument(file.type)
  };
}