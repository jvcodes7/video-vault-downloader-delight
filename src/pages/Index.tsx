
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
        console.log("Downloading from file:", file.name, "Format:", format, "Quality:", quality);
        // Here you would connect to your API to process the file
        toast.success("Processing file started!");
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        toast.error("Failed to process file");
      } finally {
        setLoading(false);
      }
    } else {
      if (!url.trim()) {
        setUrlError("Please enter a YouTube URL");
        return;
      }
      
      setLoading(true);
      try {
        console.log("Downloading URL:", url, "Format:", format, "Quality:", quality);
        // Here you would connect to your API to process the URL
        toast.success("Download started!");
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        toast.error("Failed to download");
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
    <div className="min-h-screen w-full bg-gradient-main flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm shadow-xl">
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
            disabled={isFileMode ? !file : !url} 
            loading={loading}
          />
        </CardContent>
      </Card>
      <p className="text-white text-opacity-70 mt-4 text-sm">
        For personal and educational use only
      </p>
    </div>
  );
};

export default Index;
