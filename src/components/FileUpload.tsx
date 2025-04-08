
import React from "react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface FileUploadProps {
  file: File | null;
  setFile: (file: File | null) => void;
  error?: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ file, setFile, error }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'csv' || fileExtension === 'xlsx' || fileExtension === 'txt') {
        setFile(selectedFile);
        toast.success(`File ${selectedFile.name} selected`);
      } else {
        toast.error("Only CSV, XLSX, or TXT files are allowed");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const fileExtension = droppedFile.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'csv' || fileExtension === 'xlsx' || fileExtension === 'txt') {
        setFile(droppedFile);
        toast.success(`File ${droppedFile.name} dropped`);
      } else {
        toast.error("Only CSV, XLSX, or TXT files are allowed");
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="file-upload" className="text-sm font-medium">
        Upload file with YouTube URLs
      </Label>
      <div
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
          file ? "border-green-500 bg-green-50" : error ? "border-red-500" : "border-gray-300"
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          id="file-upload"
          type="file"
          accept=".csv,.xlsx,.txt"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <Upload className="mx-auto h-10 w-10 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {file ? file.name : "Click or drag & drop a file here"}
        </p>
        <p className="mt-1 text-xs text-gray-500">CSV, XLSX, or TXT (one URL per line)</p>
      </div>
      {error && (
        <Alert variant="destructive" className="p-3 mt-2">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default FileUpload;
