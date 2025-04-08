
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UrlInputProps {
  url: string;
  setUrl: (url: string) => void;
}

const UrlInput: React.FC<UrlInputProps> = ({ url, setUrl }) => {
  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText.includes("youtube.com") || clipboardText.includes("youtu.be")) {
        setUrl(clipboardText);
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
    <div className="flex flex-col space-y-2">
      <label htmlFor="url-input" className="text-sm font-medium">
        YouTube URL
      </label>
      <div className="flex gap-2">
        <Input
          id="url-input"
          placeholder="https://www.youtube.com/watch?v=..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
        />
        <Button variant="outline" onClick={handlePaste} type="button">
          Paste
        </Button>
      </div>
    </div>
  );
};

export default UrlInput;
