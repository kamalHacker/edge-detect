import { useState } from "react";

const ImageViewer = ({ src }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="text-textPrimary p-4 flex justify-center items-center min-h-[400px]">
      {loading && !error && (
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-border border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-textSecondary">Processing image…</p>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm">Failed to load processed image</p>
      )}

      <img
        src={src}
        alt="Processed result"
        className={`max-h-[400px] object-contain rounded-xl ${
          loading ? "hidden" : "block"
        }`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />
    </div>
  );
};

export default ImageViewer;
