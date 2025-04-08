
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface DownloadButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ onClick, disabled }) => {
  return (
    <Button 
      onClick={onClick} 
      disabled={disabled} 
      className="w-full bg-gradient-to-r from-brand-blue to-brand-purple hover:opacity-90 transition-opacity"
    >
      <Download className="mr-2 h-4 w-4" />
      Download
    </Button>
  );
};

export default DownloadButton;
