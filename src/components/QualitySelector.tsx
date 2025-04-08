
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface QualitySelectorProps {
  format: "mp3" | "mp4";
  quality: string;
  setQuality: (quality: string) => void;
}

const QualitySelector: React.FC<QualitySelectorProps> = ({ format, quality, setQuality }) => {
  React.useEffect(() => {
    // Reset quality when format changes
    setQuality("");
  }, [format, setQuality]);

  const videoQualities = [
    { value: "1080p", label: "1080p (HD)" },
    { value: "720p", label: "720p (HD)" },
    { value: "480p", label: "480p (SD)" },
    { value: "360p", label: "360p (SD)" },
    { value: "240p", label: "240p (Low)" },
    { value: "144p", label: "144p (Very Low)" },
  ];

  const audioQualities = [
    { value: "320kbps", label: "320 kbps (High)" },
    { value: "256kbps", label: "256 kbps (Good)" },
    { value: "192kbps", label: "192 kbps (Medium)" },
    { value: "128kbps", label: "128 kbps (Standard)" },
    { value: "96kbps", label: "96 kbps (Low)" },
  ];

  const qualities = format === "mp3" ? audioQualities : videoQualities;

  return (
    <div className="space-y-2">
      <Label htmlFor="quality-select" className="text-sm font-medium">
        Quality
      </Label>
      <Select value={quality} onValueChange={setQuality}>
        <SelectTrigger id="quality-select">
          <SelectValue placeholder={format === "mp3" ? "Select audio quality" : "Select video quality"} />
        </SelectTrigger>
        <SelectContent>
          {qualities.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default QualitySelector;
