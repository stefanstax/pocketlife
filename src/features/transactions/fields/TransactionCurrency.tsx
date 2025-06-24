import { input, labelClasses } from "../../../app/globalClasses";
import FormError from "../../../components/FormError";
import type { CurrencyState } from "../../currency/currencyTypes";

const TransactionCurrency = ({
  currencies,
  currencyId,
  setCurrencyId,
  validationError,
}: {
  currencies: CurrencyState[];
  currencyId: string | "";
  setCurrencyId: (value: string) => void;
  validationError?: string;
}) => {
  return (
    <div className="flex flex-col">
      <label className={labelClasses} htmlFor="currency">
        Select Currency
      </label>
      <div className={`${input} flex gap-2`}>
        {currencies?.map((curr) => {
          return (
            <button
              key={curr?.code}
              type="button"
              className={`${
                currencyId === curr.id
                  ? "bg-[#5152fb] text-white border-white"
                  : ""
              } w-fit  grow-0  cursor-pointer p-2 border-black flex-1 border-dotted border-2 flex-1`}
              onClick={() => setCurrencyId(curr?.id)}
            >
              {curr?.code}
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
