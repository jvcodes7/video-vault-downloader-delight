import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UrlInput from "@/components/UrlInput";
import FormatSelector from "@/components/FormatSelector";
import QualitySelector from "@/components/QualitySelector";
import DownloadButton from "@/components/DownloadButton";
import { Youtube } from "lucide-react";
import { toast } from "sonner";
import MusicSlideshow from "@/components/MusicSlideshow";
import { Progress } from "@/components/ui/progress";

const API_BASE_URL = "http://127.0.0.1:5000/api/download";

const Index: React.FC = () => {
  const [url, setUrl] = React.useState<string>("");
  const [format, setFormat] = React.useState<"mp3" | "mp4">("mp4");
  const [quality, setQuality] = React.useState<string>("");
  const [urlError, setUrlError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [progress, setProgress] = React.useState<number>(0);
  const [showProgress, setShowProgress] = React.useState<boolean>(false);
  const [downloadType, setDownloadType] = React.useState<"single" | "playlist">("single");

  const handleDownload = async () => {
    if (!url.trim()) {
      setUrlError("Please enter a YouTube URL");
      return;
    }
    
    if (!quality) {
      toast.error("Please select a quality option");
      return;
    }

    // Validate URL based on download type
    if (downloadType === "playlist" && !url.includes("playlist?list=")) {
      setUrlError("Please enter a valid YouTube playlist URL");
      return;
    } else if (downloadType === "single" && !url.includes("watch?v=")) {
      setUrlError("Please enter a valid YouTube video URL");
      return;
    }
    
    setLoading(true);
    setProgress(0);
    setShowProgress(true);
    
    try {
      const progressInterval = simulateProgress();
      
      const formData = new FormData();
      formData.append('url', url);
      formData.append('format', format);
      formData.append('quality', quality);
      formData.append('type', downloadType);
      
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(contentDisposition || '');
      const filename = matches && matches[1] ? matches[1].replace(/['"]/g, '') : 
        downloadType === "playlist" ? `youtube_playlist.zip` : `youtube_${format}.${format}`;
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success(downloadType === "playlist" ? "Playlist download successful!" : "Download successful!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download. Please try again later.");
    } finally {
      setTimeout(() => {
        setLoading(false);
        setShowProgress(false);
      }, 1000);
    }
  };

  // Function to simulate progress
  const simulateProgress = () => {
    return setInterval(() => {
      setProgress(prevProgress => {
        // Only update progress if less than 90 (save the last bit for actual completion)
        if (prevProgress < 90) {
          const increment = Math.random() * 10;
          return Math.min(prevProgress + increment, 90);
        }
        return prevProgress;
      });
    }, 500);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative">
      {/* Background Slideshow */}
      <MusicSlideshow />
      
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
        <div className="text-white text-opacity-10 text-6xl font-bold rotate-[-30deg] select-none">
          JB Brother Pvt Ltd
        </div>
      </div>
      
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-sm shadow-xl relative z-40">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 bg-red-600 text-white rounded-full p-3 w-12 h-12 flex items-center justify-center">
            <Youtube size={24} />
          </div>
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-purple">
            Video Vault
          </CardTitle>
          <CardDescription>
            Download YouTube videos and playlists in MP4 or MP3 format
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <UrlInput 
            url={url} 
            setUrl={setUrl} 
            error={urlError} 
            setError={setUrlError}
            downloadType={downloadType}
            setDownloadType={setDownloadType}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormatSelector format={format} setFormat={setFormat} />
            <QualitySelector format={format} quality={quality} setQuality={setQuality} />
          </div>
          
          {showProgress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>{downloadType === "playlist" ? "Downloading playlist..." : "Downloading..."}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <DownloadButton 
            onClick={handleDownload} 
            disabled={!url || !quality} 
            loading={loading}
            format={format}
          />
        </CardContent>
      </Card>
      <p className="text-white text-opacity-70 mt-4 text-sm z-40">
        For personal and educational use only
      </p>
      <div className="absolute bottom-2 right-2 text-white text-opacity-50 text-xs z-40">
        © JB Brother Pvt Ltd
      </div>

      {/* CSS for grid pattern */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .bg-grid-pattern {
            background-image: linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
            background-size: 20px 20px;
          }
        `
      }} />
    </div>
  );
};

export default Index;
