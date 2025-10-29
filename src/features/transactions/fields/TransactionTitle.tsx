import { formDiv, input, labelClasses } from "../../../app/globalClasses";
import FormError from "../../../components/FormError";

const TransactionTitle = ({
  title,
  setTitle,
  validationError,
}: {
  title: string;
  setTitle: (title: string) => void;
  validationError?: string;
}) => {
  return (
    <div className={formDiv}>
      <label htmlFor="title" className={labelClasses}>
        Supplier/Receiver
      </label>

      <input
        className={input}
        type="text"
        name="title"
        value={title ?? ""}
        placeholder="What was this transaction"
        onChange={(e) => setTitle(e.target.value)}
      />
      {validationError && <FormError fieldError={validationError} />}
    </div>
  );
};

export default TransactionTitle;
