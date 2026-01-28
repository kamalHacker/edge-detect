import { useState } from "react";
import { uploadBatchZip } from "../api_communication/xrayApi";

import UploadDropzone from "../components/upload/UploadDropzone";
import BatchQueueList from "../components/batch/BatchQueue";
import BatchSidePanel from "../components/batch/BatchSidePanel";

const BatchProcessing = () => {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (zipFile) => {
    try {
      setLoading(true);
      setError(null);

      const result = await uploadBatchZip(zipFile);

      setItems(result.results);
      setSelected(result.results[0] || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="space-y-4">
          <UploadDropzone
            onFileSelect={handleUpload}
            disabled={loading}
            accept=".zip"
            title="Upload ZIP for Batch Processing"
            subtitle="ZIP file containing X-ray images"
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <BatchQueueList
            items={items}
            selectedId={selected?.image_id}
            onSelect={setSelected}
          />
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2">
          <BatchSidePanel item={selected} />
        </div>
      </div>
    </div>
  );
};

export default BatchProcessing;
