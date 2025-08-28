import { formDiv, input, labelClasses } from "../../../app/globalClasses";
import FormError from "../../../components/FormError";

const TransactionAmount = ({
  amount,
  setAmount,
  validationError,
}: {
  amount: number | "";
  setAmount: (amount: number) => void;
  validationError?: string;
}) => {
  return (
    <div className={formDiv}>
      <label htmlFor="amount" className={labelClasses}>
        Amount
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
