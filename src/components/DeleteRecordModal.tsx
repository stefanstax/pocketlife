import { DANGER, SHARED, TERTIARY } from "../app/globalClasses";

interface DeleteRecordModalProps {
  showModal: boolean;
  itemId: string | null;
  itemTitle: string | null;
  deleteFn?: (value: string) => void;
  onCancel?: () => void;
}

const DeleteRecordModal: React.FC<DeleteRecordModalProps> = ({
  showModal,
  itemId,
  itemTitle,
  deleteFn,
  onCancel,
}) => {
  if (!showModal || !itemId) return null;

  return (
    <div className="fixed inset-0 bg-[#171717]/75 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 className="text-lg font-medium mb-4">Confirm Delete</h3>
        <p className="mb-4">
          Are you sure you want to delete record <strong>{itemTitle}</strong>?
        </p>
        <div className="w-full flex gap-3">
          <button onClick={onCancel} className={`${TERTIARY} ${SHARED} flex-1`}>
            Cancel
          </button>
          <button
            onClick={() => deleteFn && deleteFn(itemId)}
            className={`${DANGER} ${SHARED} flex-1`}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteRecordModal;
