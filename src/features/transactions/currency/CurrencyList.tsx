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

  const tableColumnPadding = "p-4";
  return (
    <>
      <div className="w-full overflow-x-auto rounded-sm">
        <table className="w-full table-auto">
          <thead className="bg-blue-50 text-[#5152fb] sticky top-0 z-10">
            <tr>
              <th className={`${tableColumnPadding} min-w-[200px]`}>Code</th>
              <th className={`${tableColumnPadding} min-w-[200px]`}>Symbol</th>
              <th className={`${tableColumnPadding} min-w-[200px]`}>Name</th>

              <th className={`${tableColumnPadding} min-w-[200px]`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((currency: CurrencyState) => {
              const { code, symbol, name } = currency;
              return (
                <tr
                  key={code}
                  className="border-b text-center border-[#5152fb] hover:bg-[#f4f4ff] transition"
                >
                  <td className={`${tableColumnPadding}`}>{code}</td>
                  <td className={`${tableColumnPadding}`}>{symbol}</td>
                  <td className={`${tableColumnPadding}`}>{name}</td>

                  <td
                    className={`${tableColumnPadding} grid grid-cols-2 gap-2`}
                  >
                    <Link
                      className={`${PRIMARY} ${SHARED}`}
                      to={`/currencies/${code}`}
                    >
                      <FiEdit2 />
                    </Link>
                    <button
                      onClick={() => handleDelete(code)}
                      className="flex items-center justify-center border cursor-pointer border-black-400 bg-black p-2 text-white hover:text-neutral-700 hover:bg-transparent rounded-sm"
                    >
                      <AiOutlineDelete />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!data?.length && <NoDataFallback dataType="Currencies" />}
    </>
  );
};

export default CurrencyList;
