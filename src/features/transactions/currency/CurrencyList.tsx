import { Link } from "react-router";
import {
  useGetCurrenciesQuery,
  useRemoveCurrencyByIdMutation,
} from "./api/currenciesApi";
import type { CurrencyState } from "./currencyTypes";
import { PRIMARY, SHARED } from "../../../app/globalClasses";
import BlurredSpinner from "../../../components/BlurredSpinner";
import { toast } from "react-toastify";
import NoDataFallback from "../../../components/forms/NoDataFallback";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";

const CurrencyList = () => {
  const { data } = useGetCurrenciesQuery();
  const [removeCurrencyById, { isLoading: loadingCurrencies }] =
    useRemoveCurrencyByIdMutation();

  const handleDelete = async (code: string) => {
    await toast.promise(removeCurrencyById(code).unwrap(), {
      pending: "Currency is being removed.",
      success: "Currency has been removed.",
      error: "Currency could not be removed.",
    });
  };

  if (loadingCurrencies) return <BlurredSpinner />;

  return (
    <>
      <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-4">
        {data?.map((currency: CurrencyState) => {
          const { code, symbol, name } = currency;
          return (
            <div
              key={code}
              className="bg-gray-950 rounded-lg p-4 text-white flex flex-col gap-4"
            >
              <div className="flex items-center gap-2">
                <p>{symbol}</p>
                <p>{code}</p>
              </div>
              <p className="font-bold">{name}</p>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  className={`${PRIMARY} ${SHARED}`}
                  to={`/currencies/${code}`}
                >
                  <FiEdit2 />
                </Link>
                <button
                  className={`${PRIMARY} ${SHARED}`}
                  onClick={() => handleDelete(code)}
                >
                  <AiOutlineDelete />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {!data?.length && <NoDataFallback dataType="Currencies" />}
    </>
  );
};

export default CurrencyList;
