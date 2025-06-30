import { formDiv, input, labelClasses } from "../../../app/globalClasses";
import FormError from "../../../components/FormError";

const TransactionCurrency = ({
  currencies,
  currencyId,
  setCurrencyId,
  validationError,
}: {
  currencies: string[];
  currencyId: string | "";
  setCurrencyId: (value: string) => void;
  validationError?: string;
}) => {
  return (
    <div className={formDiv}>
      <label className={labelClasses} htmlFor="currency">
        Select Currency
      </label>
      <div className={`${input} flex flex-wrap gap-2`}>
        {currencies?.map((curr) => {
          return (
            <button
              key={curr}
              type="button"
              className={`${
                currencyId === curr
                  ? "bg-[#5152fb] text-white border-black"
                  : ""
              } min-w-[100px] rounded-sm cursor-pointer p-2 border-black border-solid border-1`}
              onClick={() => setCurrencyId(curr)}
            >
              {curr}
            </button>
          );
        })}
      </div>
      <input
        className={input}
        type="hidden"
        name="currencyId"
        value={currencyId ?? ""}
      />
      {validationError && <FormError fieldError={validationError} />}
    </div>
  );
};

export default TransactionCurrency;
