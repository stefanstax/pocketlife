import { formDiv, input, labelClasses } from "../../../app/globalClasses";
import FormError from "../../../components/FormError";

const TransactionTitle = ({
  title,
  setTitle,
  validationError,
  labelType,
}: {
  title: string;
  setTitle: (title: string) => void;
  labelType: string;
  validationError?: string;
}) => {
  return (
    <div className={formDiv}>
      <label htmlFor="title" className={labelClasses}>
        Supplier/Receiver
      </label>
      <span className="text-xs mb-2">
        Please enter {labelType === "EXPENSE" ? "business's" : "customer's"}{" "}
        full name
      </span>
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
