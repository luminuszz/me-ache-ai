"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { File, ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useState } from "react";

interface FileItem {
  file: File;
  preview?: string;
}

interface ImageDropZoneProps {
  onFilesUpload: (files: File[]) => void;
  maxSizeMB?: number;
  acceptedFileTypes?: string[];
  maxFiles?: number;
}

export function ImageDropZone({
  onFilesUpload,
  maxSizeMB = 5,
  acceptedFileTypes = ["image/jpeg", "image/png", "image/gif"],
  maxFiles = 5,
}: ImageDropZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(
    (newFiles: File[]) => {
      setError(null);
      const updatedFiles = [...files];

      newFiles.forEach((file) => {
        if (updatedFiles.length >= maxFiles) {
          setError(`Maximum ${maxFiles} files allowed.`);
          return;
        }
        if (!acceptedFileTypes.some((type) => file.type.match(type))) {
          setError("Invalid file type. Please upload accepted file types.");
          return;
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
          setError(`File size exceeds ${maxSizeMB}MB limit.`);
          return;
        }

        const fileItem: FileItem = { file };
        if (file.type.startsWith("image/")) {
          fileItem.preview = URL.createObjectURL(file);
        }
        updatedFiles.push(fileItem);
      });

      setFiles(updatedFiles);
      onFilesUpload(updatedFiles.map((item) => item.file));
    },
    [files, maxFiles, acceptedFileTypes, maxSizeMB, onFilesUpload]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFiles(Array.from(e.dataTransfer.files));
      }
    },
    [handleFiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files) {
        handleFiles(Array.from(e.target.files));
      }
    },
    [handleFiles]
  );

  const removeFile = useCallback(
    (index: number) => {
      const updatedFiles = [...files];
      if (updatedFiles[index].preview) {
        URL.revokeObjectURL(updatedFiles[index].preview!);
      }
      updatedFiles.splice(index, 1);
      setFiles(updatedFiles);
      onFilesUpload(updatedFiles.map((item) => item.file));
    },
    [files, onFilesUpload]
  );

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer ${
          dragActive ? "border-primary bg-primary/10" : "border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
        } hover:bg-gray-100 dark:hover:bg-gray-600`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
          <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Clique aqui para anexar a imagens</span> our arraste as imagens aqui
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {acceptedFileTypes.join(", ")} (MAX. {maxSizeMB}MB por arquivo)
          </p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          multiple
          accept={acceptedFileTypes.join(",")}
          onChange={handleChange}
          aria-label="Upload files"
        />
      </label>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      {files.length > 0 && (
        <ScrollArea className="w-full mt-4 border rounded-md">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Preview das imagens</h3>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li key={index} className="flex items-center justify-between p-2 rounded-md">
                  <div className="flex items-center space-x-2">
                    {file.preview ? (
                      <div className="w-10 h-10 relative">
                        <Image width={100} height={100} src={file.preview} alt={file.file.name} className="w-full h-full object-cover rounded" />
                      </div>
                    ) : file.file.type.startsWith("image/") ? (
                      <ImageIcon className="w-6 h-6 text-gray-500" />
                    ) : (
                      <File className="w-6 h-6 text-gray-500" />
                    )}
                    <span className="text-sm truncate max-w-[200px]">{file.file.name}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFile(index)} aria-label={`Remove ${file.file.name}`}>
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
