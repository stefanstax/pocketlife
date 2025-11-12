import { formDiv, input, labelClasses } from "../../../app/globalClasses";
import FormError from "../../../components/FormError";

const TransactionAmount = ({
  amount,
  setAmount,
  labelType,
  validationError,
}: {
  amount: number | "";
  setAmount: (amount: number) => void;
  labelType?: string;
  validationError?: string;
}) => {
  return (
    <div className={formDiv}>
      <label htmlFor="amount" className={labelClasses}>
        Gross amount {labelType === "EXPENSE" ? "with" : "without"} VAT
      </label>
      <span className="text-xs pb-2">You will select the currency later.</span>
      <input
        className={input}
        type="number"
        name="amount"
        step={0.1}
        placeholder="How much was this transaction"
        value={amount ?? ""}
        onChange={(e) => setAmount(+e.target.value)}
      />
      {validationError && <FormError fieldError={validationError} />}
    </div>
  );
};

export default TransactionAmount;
