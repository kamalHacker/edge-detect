import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toggle from "../common/Toggle";
import Pagination from "../common/Pagination";
import ImageViewer from "./ImageViewer";
import ProcessingDetails from "./ProcessingDetails";
import { getProcessedImageUrl } from "../../api_communication/xrayApi";
import { downloadImage } from "../../utils/downloadImage";

const ResultsView = ({ results, files }) => {
  const [index, setIndex] = useState(0);
  const [edgeType, setEdgeType] = useState("canny");
  const navigate = useNavigate();

  const current = results[index];
  const imageUrl = getProcessedImageUrl(current.image_id, edgeType);

  const handleDownload = async () => {
    const baseName = files?.[index]?.name || current.filename || "image";
    await downloadImage(
      imageUrl,
      `${baseName.replace(/\.\w+$/, "")}_${edgeType}.png`,
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* LEFT PANEL */}
        <div className="space-y-2">
          <ImageViewer src={imageUrl} />

          <div className="flex justify-center">
            <Toggle
              options={["canny", "fuzzy"]}
              value={edgeType}
              onChange={setEdgeType}
            />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-6">
          <ProcessingDetails
            timing={current.timing_sec}
            file={files?.[index]}
          />

          <div className="space-y-3">
            <button
              onClick={handleDownload}
              className="w-full py-3 rounded-lg btn-primary font-semibold"
            >
              Download Image
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full py-3 rounded-lg btn-secondary font-semibold"
            >
              Upload Another Image
            </button>
          </div>
        </div>
      </div>
      <div className={`flex justify-center 
        ${results.length > 1 ? "mt-10 border-t pt-2 border-border" : ""}
      `}>
        <Pagination
          total={results.length}
          current={index}
          onChange={setIndex}
        />
      </div>
    </div>
  );
};

export default ResultsView;
