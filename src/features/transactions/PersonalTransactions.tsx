import type { Receipt, Transaction } from "./transactionTypes";
import type { CurrencyState } from "../currency/currencyTypes";
import { Link } from "react-router";
import { PRIMARY, SHARED } from "../../app/globalClasses";
import NoDataFallback from "../../components/forms/NoDataFallback";

type Props = {
  data: (Transaction & { currency: CurrencyState; receipt?: Receipt })[];
};

const PersonalTransactions = ({ data }: Props) => {
  return (
    <>
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="bg-black text-white">
            <th className="p-2 w-[100px]">Date</th>
            <th className="p-2 w-[100px]">Type</th>
            <th className="p-2 w-[100px]">Title</th>
            <th className="p-2 w-[100px]">Amount</th>
            <th className="p-2 w-[100px]">Note</th>
            <th className="p-2 w-[100px]">Receipt</th>
            <th className="p-2 w-[100px]">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data?.map((transaction) => {
            const {
              id,
              title,
              type,
              amount,
              currency,
              note,
              date,
              context,
              receipt,
            } = transaction;
            return (
              <tr
                key={id}
                className="border-b border-[#5152fb] hover:bg-[#f4f4ff] transition "
              >
                <td className="p-2">{date}</td>
                <td className="p-2">{type}</td>
                <td className="p-2">{title}</td>
                <td className="p-2">
                  {currency?.symbol}
                  {amount}
                </td>
                <td className="p-2">{note?.trim() ? note : "No note"}</td>
                <td className="p-2">
                  {context === "BUSINESS" && !receipt ? (
                    <span className="text-red-500">*Receipt missing</span>
                  ) : receipt ? (
                    "Attached"
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-2">
                  <Link
                    className={`${PRIMARY} ${SHARED} `}
                    to={`http://localhost:5173/transactions/${id}`}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {!data?.length && <NoDataFallback dataType="personal transaction" />}
    </>
  );
};

export default PersonalTransactions;
