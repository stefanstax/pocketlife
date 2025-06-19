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

  return (
    <section className="bg-[#1b1918] text-white rounded-lg p-4">
      <div className="flex gap-4 flex-wrap items-stretch justify-start">
        {data?.length === undefined && (
          <>
            <p>Hey {user?.username}, add your first transaction! </p>
            <VariantLink
              variant="PRIMARY"
              aria="Go to transaction addition page"
              type="button"
              label="Add new transaction"
              link="http://localhost:5173/transactions/add"
            />
          </>
        )}

        {data?.length &&
          data?.map(
            (transaction: Transaction & { currency: CurrencyState }) => {
              const { id, title, type, currency, amount, note, date, context } =
                transaction;
              return (
                <div
                  key={id}
                  className={`${
                    context === "BUSINESS" ? "bg-black" : "bg-transparent"
                  } flex min-w-[200px] max-w-fit flex-1 flex-col gap-2 border-2 border-solid rounded-lg`}
                >
                  <p className="w-full bg-white font-bold text-xs text-black text-center">
                    {context ?? "PERSONAL"}
                  </p>
                  <div className="flex flex-col flex-1 flex-wrap items-stretch justify-between gap-4 px-4 py-2">
                    {/* Date */}
                    <p className="text-xs">{date}</p>
                    {/* Title */}
                    <p className="font-black flex items-center gap-2">
                      <span
                        className={`w-[10px] h-[10px] rounded-full ${
                          type === "EXPENSE"
                            ? "bg-red-500"
                            : type === "INCOME"
                            ? "bg-green-500"
                            : type === "SAVINGS"
                            ? "bg-blue-500"
                            : ""
                        }`}
                      ></span>
                      {title}
                    </p>
                    {/* Currency & Amount */}
                    <p>
                      {currency?.symbol}
                      {amount}
                    </p>
                    {/* Note */}
                    <p className="text-sm">{note.trim() ? note : "No note"}</p>
                    {/* Edit Button */}
                    <Link
                      className={buttonSecondary}
                      to={`http://localhost:5173/transactions/${id}`}
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              );
            }
          )}

        {data?.length && (
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
