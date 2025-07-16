import { formDiv, input, labelClasses } from "../../../app/globalClasses";
import FormError from "../../../components/FormError";
import { transactionTypes, type TransactionTypes } from "../transactionTypes";

const TransactionType = ({
  type,
  setType,
  validationError,
}: {
  type: string;
  setType: (value: TransactionTypes) => void;
  validationError?: string;
}) => {
  return (
    <div className={formDiv}>
      <label className={labelClasses} htmlFor="type">
        Transaction Type
      </label>
      <div className={`${input} flex flex-wrap gap-2`}>
        {transactionTypes.map((option) => {
          return (
            <button
              key={option.name}
              className={`${
                option.name === type
                  ? "bg-gray-950 text-white border-black"
                  : ""
              } text-sm font-[600]  min-w-[100px] rounded-full cursor-pointer p-2 border-black border-solid border-1`}
              type="button"
              onClick={() => setType(option.name as TransactionTypes)}
            >
              {option.name}
            </button>
          );
        })}
      </div>
      <input type="hidden" name="type" value={type ?? ""} className={input} />
      {validationError && <FormError fieldError={validationError} />}
    </div>
  );
};

export default TransactionType;
