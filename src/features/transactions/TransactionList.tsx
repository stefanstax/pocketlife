import { useSelector } from "react-redux";
import { useLocalApi } from "../../app/hooks";
import type { Transaction } from "./transactionTypes";
import type { RootState } from "../../app/store";
import VariantLink from "../../components/VariantLink";
import { Link } from "react-router";
import { buttonSecondary } from "../../app/globalClasses";
import type { CurrencyState } from "../currency/currencyTypes";

const TransactionList = () => {
  const { data, isLoading, isPending } = useLocalApi("transactions");

  const { user } = useSelector((state: RootState) => state.auth);
  if (isLoading || isPending) {
    return <h1>Loading...</h1>;
  }

  const filteredTransactions = data.filter(
    (transaction: Transaction) => transaction.userId === user?.id
  );

  return (
    <section className="bg-[#1b1918] text-white rounded-lg p-4">
      <div className="flex gap-4 flex-wrap items-stretch justify-start">
        {!filteredTransactions?.length && (
          <>
            <h2>You have not added any transactions.</h2>
            <VariantLink
              variant="PRIMARY"
              aria="Go to transaction addition page"
              type="button"
              label="Add new transaction"
              link="http://localhost:5173/transactions/add"
            />
          </>
        )}
        {filteredTransactions.map(
          (transaction: Transaction & { currency: CurrencyState }) => {
            const { id, title, type, currency, amount, note, date } =
              transaction;
            return (
              <div
                key={id}
                className="flex w-[200px] justify-start items-start flex-col gap-2 border-2 border-dotted rounded-lg px-4 py-2"
              >
                <p
                  className={`${
                    type === "EXPENSE"
                      ? "bg-red-500"
                      : type === "INCOME"
                      ? "bg-green-500"
                      : type === "SAVINGS"
                      ? "bg-blue-500"
                      : ""
                  } w-full text-xs text-center text-white rounded-lg py-1`}
                >
                  {date}
                </p>
                <p className="font-black">{title}</p>
                <p>
                  {currency?.symbol}
                  {amount}
                </p>
                <span className="text-xs">Aprox in Eur: {amount * 1.19}</span>
                <p className="text-sm">{note}</p>
                <Link
                  className={buttonSecondary}
                  to={`http://localhost:5173/transactions/${id}`}
                >
                  🖊️
                </Link>
              </div>
            );
          }
        )}
        {filteredTransactions?.length && (
          <div className="flex border-2 border-dotted rounded-lg">
            <VariantLink
              link="http://localhost:5173/transactions/add"
              variant="PRIMARY"
              aria="Go to transactions add page"
              label="Add new Transaction"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default TransactionList;
