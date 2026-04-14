import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadZoneProps {
  onFilesChange: (files: File[]) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFilesChange }) => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles];
    setFiles(newFiles);
    onFilesChange(newFiles);
  }, [files, onFilesChange]);

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`group relative overflow-hidden rounded-2xl border-2 border-dashed p-8 transition-all duration-300 ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-white/10 bg-white/5 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`rounded-full p-4 transition-colors duration-300 ${
            isDragActive ? 'bg-primary text-background' : 'bg-surface text-primary'
          }`}>
            <Upload size={32} />
          </div>
          <div className="text-center">
            <p className="text-xl font-medium">
              {isDragActive ? 'Drop your resumes here' : 'Click or drag resumes to upload'}
            </p>
            <p className="mt-1 text-sm text-white/50">PDF files only (Max 10 files)</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 gap-2 sm:grid-cols-2"
          >
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-between rounded-xl bg-surface p-3 border border-white/5"
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <FileText size={20} className="text-primary shrink-0" />
                  <span className="truncate text-sm font-medium">{file.name}</span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="rounded-lg p-1 text-white/30 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
