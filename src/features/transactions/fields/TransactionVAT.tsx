import {
  formDiv,
  input,
  inputPicked,
  labelClasses,
} from "../../../app/globalClasses";
import FormError from "../../../components/FormError";
import {
  transactionVATOption,
  type TransactionVATOption,
} from "../types/transactionTypes";

const TransactionVAT = ({
  vat,
  setVat,
  validationError,
}: {
  vat: string;
  setVat: (value: TransactionVATOption) => void;
  validationError?: string;
}) => {
  return (
    <div className={formDiv}>
      <label className={labelClasses} htmlFor="type">
        VAT
      </label>
      <div className={`${input} flex flex-wrap gap-2`}>
        {transactionVATOption.map((option) => {
          return (
            <button
              key={option.name}
              className={`${
                option.name === vat ? inputPicked : ""
              } text-sm min-w-[100px] cursor-pointer p-2 `}
              type="button"
              onClick={() => setVat(option.name as TransactionVATOption)}
            >
              {option.name}
            </button>
          );
        })}
      </div>
      <input type="hidden" name="type" value={vat ?? ""} className={input} />
      {validationError && <FormError fieldError={validationError} />}
    </div>
  );
};

export default TransactionVAT;
