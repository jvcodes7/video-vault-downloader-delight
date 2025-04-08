
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Headphones, Video } from "lucide-react";

interface FormatSelectorProps {
  format: "mp3" | "mp4";
  setFormat: (format: "mp3" | "mp4") => void;
}

const FormatSelector: React.FC<FormatSelectorProps> = ({ format, setFormat }) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Format</Label>
      <RadioGroup
        value={format}
        onValueChange={(value) => setFormat(value as "mp3" | "mp4")}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="mp4" id="mp4" />
          <Label htmlFor="mp4" className="flex items-center gap-1 cursor-pointer">
            <Video size={16} />
            <span>Video (MP4)</span>
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="mp3" id="mp3" />
          <Label htmlFor="mp3" className="flex items-center gap-1 cursor-pointer">
            <Headphones size={16} />
            <span>Audio (MP3)</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default FormatSelector;
