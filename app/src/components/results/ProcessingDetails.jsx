import { Clock } from "lucide-react";

const ProcessingDetails = ({ timing, file }) => {
  if (!timing) return null;

  const ms = (v) => Math.round(v * 1000);

  console.log("file : ", file);

  return (
    <div className="rounded-xl p-3 space-y-4 shadow-md">
      <h3 className="font-bold text-textPrimary text-lg mb-3">
        Processing Details
      </h3>

      {file && (
        <div className="space-y-1 border-b border-border pb-3">
          <h4 className="font-semibold text-gray-500">
            Processed Image Details
          </h4>
          <div className="flex justify-between text-sm">
            <span className="text-textSecondary">File name</span>
            <span className="text-textPrimary font-medium">{file.name}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-textSecondary">Format</span>
            <span className="text-textPrimary font-medium">
              {file.type.replace("image/", "").toUpperCase()}
            </span>
          </div>
        </div>
      )}

      {timing && (<div className="space-y-1">
        <h4 className="font-semibold text-gray-500">Processing Timings</h4>
        <div className="flex justify-between text-sm">
          <span className="text-textSecondary">Preprocessing</span>
          <span className="text-textPrimary font-medium">
            {ms(timing.preprocess)} ms
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-textSecondary">Canny Edge Detection</span>
          <span className="text-textPrimary font-medium">
            {ms(timing.canny)} ms
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-textSecondary">Fuzzy Edge Detection</span>
          <span className="text-textPrimary font-medium">
            {ms(timing.fuzzy)} ms
          </span>
        </div>
      </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2 text-primary font-semibold">
          <Clock className="w-5 h-5" />
          Total Time
        </div>

        <span className="px-3 py-1 rounded-lg bg-primary text-white font-bold text-sm">
          {ms(timing.total)} ms
        </span>
      </div>
    </div>
  );
};

export default ProcessingDetails;
