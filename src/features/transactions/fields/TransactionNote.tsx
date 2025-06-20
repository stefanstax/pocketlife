import { formDiv, input, labelClasses } from "../../../app/globalClasses";
import FormError from "../../../components/FormError";

const TransactionNote = ({
  note,
  setNote,
  validationError,
}: {
  note: string;
  setNote: (value: string) => void;
  validationError?: string;
}) => {
  return (
    <div className={formDiv}>
      <label htmlFor="note" className={labelClasses}>
        Note
      </label>
      <input
        className={input}
        type="text"
        name="note"
        placeholder="Any note for transaction"
        value={note ?? ""}
        onChange={(event) => setNote(event.target.value)}
      />
      {validationError && <FormError fieldError={validationError} />}
    </div>
  );
};

export default TransactionNote;
