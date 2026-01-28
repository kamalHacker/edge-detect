import { useRef } from "react";
import { Upload } from "lucide-react";

const UploadDropzone = ({ onFileSelect, disabled }) => {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) onFileSelect(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files || []);
    if (files.length) onFileSelect(files);
  };

  return (
    <div
      onClick={() => !disabled && inputRef.current.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition
        ${disabled ? "border-border bg-gray-100" : "border-gray-400 bg-gray-100 hover:border-primary bg-surface"}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      <Upload className="mx-auto font-bold mb-4 w-8 h-8 text-textPrimary" />

      <p className="text-lg font-bold text-textPrimary">
        Drag & drop X-ray images here
      </p>

      <p className="text-sm text-primary mt-2">
        or click to browse
      </p>
    </div>
  );
};

export default UploadDropzone;
