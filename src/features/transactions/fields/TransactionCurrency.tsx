import {
  formDiv,
  input,
  inputPicked,
  labelClasses,
} from "../../../app/globalClasses";
import FormError from "../../../components/FormError";
import type { CurrencyState } from "../currency/types/currencyTypes";
import type { Budget } from "../paymentMethods/types/paymentMethodsTypes";

const TransactionCurrency = ({
  currencies,
  currencyId,
  setCurrencyId,
  validationError,
}: {
  currencies: CurrencyState[] | Budget[];
  currencyId: string | "";
  setCurrencyId: (value: string) => void;
  validationError?: string;
}) => {
  function isCurrencyArray(
    data: CurrencyState[] | Budget[]
  ): data is CurrencyState[] {
    return "symbol" in (data?.[0] ?? {});
  }

  function isBudgetArray(data: CurrencyState[] | Budget[]): data is Budget[] {
    return "amount" in (data?.[0] ?? {});
  }

  return (
    <div className={formDiv}>
      <label className={labelClasses} htmlFor="currency">
        Wallet
      </label>
      <div className={`${input} flex flex-wrap gap-2`}>
        {isCurrencyArray(currencies) &&
          currencies?.map((curr) => {
            return (
              <button
                key={curr?.code}
                type="button"
                className={`text-sm ${
                  currencyId === curr?.code ? "bg-[#1A1A2E] text-white " : ""
                } min-w-[100px] cursor-pointer p-2`}
                onClick={() => setCurrencyId(curr?.code)}
              >
                {curr?.code}
              </button>
            );
          })}
        {isBudgetArray(currencies) &&
          currencies?.map((curr) => {
            return (
              <button
                key={curr?.id}
                type="button"
                className={`text-sm font-[600] ${
                  currencyId === curr?.currencyId ? inputPicked : ""
                } min-w-[100px] cursor-pointer p-2 `}
                onClick={() => setCurrencyId(curr?.currencyId)}
              >
                {curr?.currencyId}
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
