import { formDiv, input, labelClasses } from "../../../app/globalClasses";
import FormError from "../../../components/FormError";

const TransactionNote = ({
  note,
  setNote,
  labelType,
  validationError,
}: {
  note: string;
  setNote: (value: string) => void;
  labelType: string;
  validationError?: string;
}) => {
  return (
    <div className={formDiv}>
      <label htmlFor="note" className={labelClasses}>
        {labelType === "EXPENSE"
          ? "What service was purchased"
          : "What service was supplied"}
      </label>
      <textarea
        className={input}
        name="note"
        placeholder={`Describe ${
          labelType === "EXPENSE" ? "purchased" : "sold"
        } service`}
        value={note ?? ""}
        onChange={(event) => setNote(event.target.value)}
      />
      {validationError && <FormError fieldError={validationError} />}
    </div>
  );
};

export default TransactionNote;
