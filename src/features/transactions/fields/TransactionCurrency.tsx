import { formDiv, input, labelClasses } from "../../../app/globalClasses";
import FormError from "../../../components/FormError";
import type { Budget } from "../paymentMethods/paymentMethodsTypes";

const TransactionCurrency = ({
  currencies,
  currencyId,
  setCurrencyId,
  validationError,
}: {
  currencies: Budget[] | string[];
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
          if (typeof curr === "object" && curr !== null && "id" in curr) {
            return (
              <button
                key={curr.id}
                type="button"
                className={`text-sm font-[600] ${
                  currencyId === curr.currencyId
                    ? "bg-gray-950 text-white border-black"
                    : ""
                } min-w-[100px] rounded-lg cursor-pointer p-2 border-black border-solid border-1`}
                onClick={() => setCurrencyId(curr.currencyId)}
              >
                {curr.currencyId}
              </button>
            );
          } else {
            return (
              <button
                key={curr as string}
                type="button"
                className={`${
                  currencyId === curr
                    ? "bg-gray-950 text-white border-black"
                    : ""
                } min-w-[100px] rounded-lg cursor-pointer p-2 border-black border-solid border-1`}
                onClick={() => setCurrencyId(curr as string)}
              >
                {curr}
              </button>
            );
          }
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
