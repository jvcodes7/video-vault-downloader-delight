
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UrlInput from "@/components/UrlInput";
import FileUpload from "@/components/FileUpload";
import FormatSelector from "@/components/FormatSelector";
import QualitySelector from "@/components/QualitySelector";
import DownloadButton from "@/components/DownloadButton";
import { Youtube } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import MusicSlideshow from "@/components/MusicSlideshow";

const API_BASE_URL = "http://127.0.0.1:5000/api/download"; // Updated to use local server

const Index: React.FC = () => {
  const [url, setUrl] = React.useState<string>("");
  const [format, setFormat] = React.useState<"mp3" | "mp4">("mp4");
  const [quality, setQuality] = React.useState<string>("");
  const [isFileMode, setIsFileMode] = React.useState<boolean>(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [urlError, setUrlError] = React.useState<string | null>(null);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleDownload = async () => {
    if (isFileMode) {
      if (!file) {
        setFileError("Please upload a file first");
        return;
      }
      
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('format', format);
        formData.append('quality', quality);
        
        const response = await fetch(`${API_BASE_URL}/batch`, {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        // Get filename from Content-Disposition header or use a default
        const contentDisposition = response.headers.get('Content-Disposition');
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDisposition || '');
        const filename = matches && matches[1] ? matches[1].replace(/['"]/g, '') : `youtube_${format}_batch.zip`;
        
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        
        // Create a link and trigger download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        toast.success("Download successful!");
      } catch (error) {
        console.error("Download error:", error);
        toast.error("Failed to download. Please try again later.");
      } finally {
        setLoading(false);
      }
    } else {
      if (!url.trim()) {
        setUrlError("Please enter a YouTube URL");
        return;
      }
      
      if (!quality) {
        toast.error("Please select a quality option");
        return;
      }
      
      setLoading(true);
      try {
        // Using POST instead of GET for URL downloads
        const formData = new FormData();
        formData.append('url', url);
        formData.append('format', format);
        formData.append('quality', quality);
        
        const response = await fetch(API_BASE_URL, {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        // Get filename from Content-Disposition header or create a default one
        const contentDisposition = response.headers.get('Content-Disposition');
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDisposition || '');
        const filename = matches && matches[1] ? matches[1].replace(/['"]/g, '') : `youtube_${format}.${format}`;
        
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        // Create a link element and trigger download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        toast.success("Download successful!");
      } catch (error) {
        console.error("Download error:", error);
        toast.error("Failed to download. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTabChange = (value: string) => {
    setIsFileMode(value === "file");
    // Reset errors when switching tabs
    setUrlError(null);
    setFileError(null);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 flex flex-col items-center justify-center p-4 relative">
      {/* Animated background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-white text-opacity-10 text-6xl font-bold rotate-[-30deg] select-none">
          JB Brother Pvt Ltd
        </div>
      </div>
      
      {/* Slideshow */}
      <div className="mb-8 w-full max-w-2xl">
        <MusicSlideshow />
      </div>
      
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm shadow-xl relative z-10">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 bg-red-600 text-white rounded-full p-3 w-12 h-12 flex items-center justify-center">
            <Youtube size={24} />
          </div>
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-purple">
            Video Vault
          </CardTitle>
          <CardDescription>
            Download YouTube videos in MP4 or MP3 format
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="url" onClick={() => handleTabChange("url")}>URL</TabsTrigger>
              <TabsTrigger value="file" onClick={() => handleTabChange("file")}>File Upload</TabsTrigger>
            </TabsList>
            <TabsContent value="url" className="space-y-4">
              <UrlInput url={url} setUrl={setUrl} error={urlError} setError={setUrlError} />
            </TabsContent>
            <TabsContent value="file" className="space-y-4">
              <FileUpload 
                file={file} 
                setFile={(newFile) => {
                  setFile(newFile);
                  if (newFile) {
                    setFileError(null);
                  }
                }} 
                error={fileError}
              />
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormatSelector format={format} setFormat={setFormat} />
            <QualitySelector format={format} quality={quality} setQuality={setQuality} />
          </div>

          <DownloadButton 
            onClick={handleDownload} 
            disabled={isFileMode ? !file : !url || !quality} 
            loading={loading}
            format={format}
          />
        </CardContent>
      </Card>
      <p className="text-white text-opacity-70 mt-4 text-sm z-10">
        For personal and educational use only
      </p>
      <div className="absolute bottom-2 right-2 text-white text-opacity-50 text-xs z-10">
        © JB Brother Pvt Ltd
      </div>

      {/* For the grid pattern in the background */}
      <style jsx global>{`
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};

export default Index;
