import Card from "../ui/Card";
import { useDatasetStore } from "../../store/datasetStore";

export default function RecentUploads() {
  const dataset = useDatasetStore((state) => state.dataset);

  const metadata = dataset?.metadata;

  return (
    <Card>
      <h3 className="mb-6 text-lg font-semibold">
        Recent Upload
      </h3>

      {!metadata ? (
        <p className="text-slate-500">
          No dataset uploaded yet.
        </p>
      ) : (
        <div className="space-y-5">
          <div>
            <p className="text-sm text-slate-500">
              Filename
            </p>

            <p className="font-semibold">
              {metadata.filename}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Extension
            </p>

            <p>{metadata.extension}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Uploaded
            </p>

            <p>{new Date(metadata.upload_time).toLocaleString()}</p>
          </div>
        </div>
      )}
    </Card>
  );
}