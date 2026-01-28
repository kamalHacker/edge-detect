import { useState } from "react";
import { useNavigate } from "react-router-dom";
import JSZip from "jszip";
import UploadCard from "../components/upload/UploadCard";
import {
  uploadSingleImage,
  uploadBatchZip,
} from "../api_communication/xrayApi";
import DashboardLoader from "../components/common/DashboardLoader";

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!files.length) return;

    try {
      setProcessing(true);
      setError(null);

      if (files.length === 1) {
        const result = await uploadSingleImage(files[0]);

        navigate("/results", {
          state: {
            mode: "single",
            result,
            file: files[0],
          },
        });
      } else {
        const zip = new JSZip();
        files.forEach((file) => zip.file(file.name, file));

        const blob = await zip.generateAsync({ type: "blob" });
        const zipFile = new File([blob], "batch.zip", {
          type: "application/zip",
        });

        const result = await uploadBatchZip(zipFile);

        navigate("/results", {
          state: {
            mode: "batch",
            result,
            files,
          },
        });
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Processing failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="relative mt-10 space-y-6">
      {processing && <DashboardLoader count={files.length}/>}

      <UploadCard
        files={files}
        onFileSelect={setFiles}
        onSubmit={handleSubmit}
        processing={processing}
      />

      {error && <p className="text-center text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default Dashboard;
