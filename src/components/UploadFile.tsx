// ✅ UploadField.tsx
import { useRef } from "react";
import { formDiv, input, labelClasses } from "../app/globalClasses";
import { uploadFileToBunny } from "../features/transactions/mutations/uploadtoBunny";
import type { Receipt } from "../features/transactions/transactionTypes";

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

    const result = await uploadFileToBunny({
      file,
      username,
    });

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
        <div className="flex gap-2 items-center text-xs flex-wrap">
          <button
            type="button"
            className="border-2 border-dotted border-white px-4 rounded-lg py-2"
            onClick={handleFileClick}
          >
            Upload New Receipt
          </button>
          {currentUrl?.includes("/add") && receipt?.name && (
            <p className="border-2 border-dotted border-white px-4 rounded-lg py-2">
              {receipt?.name} uploaded!
            </p>
          )}

          {hasFile && receipt?.url && hasFile}
        </div>

        <input
          type="file"
          name="receipt"
          ref={fileInputRef}
          onChange={handleUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default UploadField;
