import UploadDropzone from "./UploadDropzone";

const UploadCard = ({ files, onFileSelect, onSubmit, processing }) => {
  return (
    <div className="max-w-xl mx-auto shadow-md rounded-xl p-8 space-y-6">
      <UploadDropzone onFileSelect={onFileSelect} disabled={processing} />

      {files.length > 0 && (
        <div className="text-sm text-textSecondary">
          Selected:{" "}
          <span className="text-textPrimary font-medium">
            {files.length} image{files.length > 1 ? "s" : ""}
          </span>
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={!files.length || processing}
        className={`w-full py-3 rounded-md font-semibold transition btn-primary
          ${processing || !files.length
            ? "cursor-not-allowed"
            : "hover:bg-primaryDark text-white"}
        `}
      >
        {processing ? "Processing..." : "Process Images"}
      </button>
    </div>
  );
};

export default UploadCard;
