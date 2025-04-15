
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Link2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface UrlInputProps {
  url: string;
  setUrl: (url: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
  downloadType: "single" | "playlist";
  setDownloadType: (type: "single" | "playlist") => void;
}

const UrlInput: React.FC<UrlInputProps> = ({ 
  url, 
  setUrl, 
  error, 
  setError, 
  downloadType,
  setDownloadType 
}) => {
  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText.includes("youtube.com") || clipboardText.includes("youtu.be")) {
        setUrl(clipboardText);
        setError(null);
        toast.success("YouTube URL pasted successfully");
      } else {
        toast.error("Not a valid YouTube URL");
      }
    } catch (error) {
      toast.error("Failed to access clipboard");
      console.error("Clipboard error:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Download Type</Label>
        <RadioGroup
          value={downloadType}
          onValueChange={(value: "single" | "playlist") => setDownloadType(value)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="single" id="single" />
            <Label htmlFor="single">Single Video</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="playlist" id="playlist" />
            <Label htmlFor="playlist">Playlist</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="url-input" className="text-sm font-medium">
          {downloadType === "single" ? "Video URL" : "Playlist URL"}
        </Label>
        <div className="flex gap-2">
          <Input
            id="url-input"
            placeholder={downloadType === "single" ? 
              "https://www.youtube.com/watch?v=..." : 
              "https://www.youtube.com/playlist?list=..."
            }
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (e.target.value) {
                setError(null);
              }
            }}
            className={`flex-1 ${error ? "border-red-500" : ""}`}
          />
          <Button variant="outline" onClick={handlePaste} type="button">
            Paste
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="p-3">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default UrlInput;
