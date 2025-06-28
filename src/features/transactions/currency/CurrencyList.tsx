import { Link } from "react-router";
import {
  useGetCurrenciesQuery,
  useRemoveCurrencyByIdMutation,
} from "./api/currenciesApi";
import type { CurrencyState } from "./currencyTypes";
import { PRIMARY, SHARED } from "../../../app/globalClasses";
import BlurredSpinner from "../../../components/BlurredSpinner";
import { useState } from "react";

const CurrencyList = () => {
  const { data } = useGetCurrenciesQuery();
  const [removeCurrencyById, { isLoading: loadingCurrencies, isSuccess }] =
    useRemoveCurrencyByIdMutation();
  const [serverMessage, setServerMessage] = useState<any>();
  const [currencyRemoval, setCurrencyRemoval] = useState<string | null>(null);

  const handleDelete = async (code: string) => {
    try {
      await removeCurrencyById(code).unwrap();
      setCurrencyRemoval(code);
      setServerMessage(`Currency ${code} has been removed.`);
    } catch (error) {
      setServerMessage(error?.data?.message ?? "Uncaught error.");
    }
  };

  if (loadingCurrencies) return <BlurredSpinner />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 flex-wrap gap-4">
      {data?.map((currency: CurrencyState) => {
        return (
          <div
            key={currency?.code}
            className="flex rounded-sm shadow-2xl flex-col border border-solid p-4 gap-4"
          >
            <p className="font-bold min-w-[200px]">
              ({currency?.symbol}) {currency?.name}
            </p>
            <p>Number of transactions with this currency: </p>
            <div className="flex gap-2">
              <Link
                className={`${PRIMARY} ${SHARED} flex-1`}
                to={`/currencies/${currency?.code}`}
              >
                Edit currency
              </Link>
              <button
                onClick={() => handleDelete(currency?.code)}
                className="flex flex-1 rounded-sm gap-2 items-center justify-center border border-black-400 bg-black p-2 text-white hover:text-neutral-700 hover:bg-transparent"
              >
                {currencyRemoval === currency?.code && CurrencyRemoveLoading
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        );
      })}
      {serverMessage || isSuccess ? (
        <div className="rounded-sm shadow-xl bg-black w-fit text-white p-2">
          <p>{serverMessage}</p>
        </div>
      ) : null}
    </div>
  );
};

export default CurrencyList;
