import { formDiv, input, labelClasses } from "../../../app/globalClasses";
import FormError from "../../../components/FormError";
import {
  transactionContexts,
  type TransactionContexts,
} from "../transactionTypes";

const TransactionContext = ({
  context,
  setContext,
  validationError,
}: {
  context: string;
  setContext: (value: TransactionContexts) => void;
  validationError?: string;
}) => {
  return (
    <div className={formDiv}>
      <label className={labelClasses} htmlFor="variant">
        Transaction Context
      </label>
      <div className={`${input} flex gap-2 text-xs`}>
        {transactionContexts.map((option) => {
          return (
            <button
              key={option.name}
              type="button"
              className={`border-2 border-dotted border-black px-4  py-2 ${
                option.name === context
                  ? "bg-[#5152fb] text-white border-white"
                  : ""
              }`}
              onClick={() => setContext(option.name as TransactionContexts)}
            >
              {option.name}
            </button>
          );
        })}
        <input type="hidden" value={context ?? ""} name="context" />
      </div>
      {validationError && <FormError fieldError={validationError} />}
    </div>
  );
};

export default TransactionContext;
