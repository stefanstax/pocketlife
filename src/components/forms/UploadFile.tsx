import { useRef } from "react";
import type { Receipt } from "../../features/transactions/types/transactionTypes";
import { uploadFileToBunny } from "../../features/transactions/api/uploadtoBunny";
import { formDiv, input, labelClasses } from "../../app/globalClasses";
import { toast } from "react-toastify";

const UploadField = ({
  receipt,
  setReceipt,
  username,
  hasFile,
}: {
  receipt: Receipt | null;
  setReceipt: (receipt: Receipt) => void;
  username: string;
  hasFile?: React.ReactNode;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const currentUrl = document.URL;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // * If file is above 20MB alert and block upload
    if (file?.size > 20971520) {
      toast.warning("Please upload a file smaller than 20MB.");
      return;
    }

    const result = await toast.promise(
      uploadFileToBunny({
        file,
        username,
      }),
      {
        pending: "File is being uploaded",
        success: "File has been uploaded",
        error: "There was an issue uploading this file.",
      }
    );

    if (result?.url) {
      setReceipt({
        id: result.id,
        name: result.name,
        url: result.url,
      });
    }

    fileInputRef.current!.value = "";
  };

  return (
    <div className={formDiv}>
      <label className={labelClasses}>Upload Receipt</label>

      <div className={input}>
        <div className="flex gap-2 items-center flex-wrap">
          <button type="button" className="px-4 py-2" onClick={handleFileClick}>
            Upload New Receipt
          </button>
          {currentUrl?.includes("/add") && receipt?.name && (
            <p className="px-4 py-2">{receipt?.name} uploaded!</p>
          )}

          {hasFile && receipt?.url && hasFile}
        </div>

        <input
          type="file"
          name="receipt"
          ref={fileInputRef}
          onChange={handleUpload}
          className="hidden"
          accept="image/*, application/pdf"
        />
      </div>
    </div>
  );
};

export default UploadField;
