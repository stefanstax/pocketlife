import { Link } from "react-router";
import { useLocalApi } from "../../app/hooks";
import { useRemoveCurrencyByIdMutation } from "./api/currenciesApi";
import type { CurrencyState } from "./currencyTypes";
import { RiDeleteBin6Line } from "react-icons/ri";
import { PRIMARY, SHARED } from "../../app/globalClasses";

const CurrencyList = () => {
  const { data, isLoading, isPending } = useLocalApi("currencies");
  const [removeCurrencyById] = useRemoveCurrencyByIdMutation();

  const handleDelete = async (id: string) => {
    try {
      await removeCurrencyById(id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };
  if (isLoading || isPending) return <h1>Loading...</h1>;
  return (
    <div className="flex gap-4">
      {data?.map((currency: CurrencyState) => {
        return (
          <div className="flex flex-col border border-solid p-4 gap-4">
            <p className="font-bold min-w-[200px]">
              ({currency?.symbol}) {currency?.name}
            </p>
            <p>Number of transactions with this currency: </p>
            <Link
              className={`${PRIMARY} ${SHARED}`}
              to={`/currencies/${currency?.id}`}
            >
              Edit currency
            </Link>
            <button
              onClick={() => handleDelete(currency?.id)}
              className="flex gap-2 items-center justify-center border border-red-400 bg-red-400 p-2 text-white hover:text-red-400 hover:bg-transparent"
            >
              Delete
              <RiDeleteBin6Line />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default CurrencyList;
