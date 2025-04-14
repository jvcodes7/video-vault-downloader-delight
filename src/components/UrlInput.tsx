
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface UrlInputProps {
  url: string;
  setUrl: (url: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
  placeholder?: string;
}

const UrlInput: React.FC<UrlInputProps> = ({ 
  url, 
  setUrl, 
  error, 
  setError, 
  placeholder = "https://www.youtube.com/watch?v=..." 
}) => {
  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      
      // Check if it's a single YouTube URL or multiple URLs
      if (clipboardText.includes("youtube.com") || clipboardText.includes("youtu.be")) {
        setUrl(clipboardText);
        setError(null);
        toast.success("YouTube URL(s) pasted successfully");
      } else {
        toast.error("No valid YouTube URLs found in clipboard");
      }
    } catch (error) {
      toast.error("Failed to access clipboard");
      console.error("Clipboard error:", error);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor="url-input" className="text-sm font-medium text-white">
        YouTube URLs
      </label>
      <div className="flex flex-col gap-2">
        <Textarea
          id="url-input"
          placeholder={placeholder}
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (e.target.value) {
              setError(null);
            }
          }}
          className={`flex-1 min-h-[100px] bg-black/30 border-gray-700 text-white ${error ? "border-red-500" : ""}`}
        />
        <Button variant="outline" onClick={handlePaste} type="button" className="self-end bg-black/30 text-white border-gray-700 hover:bg-black/50">
          Paste
        </Button>
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

export default UrlInput;
