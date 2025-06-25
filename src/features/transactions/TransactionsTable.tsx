import type { Receipt, Transaction } from "./transactionTypes";
import type { CurrencyState } from "./currency/currencyTypes";
import { Link } from "react-router-dom";
import { PRIMARY, SHARED } from "../../app/globalClasses";
import NoDataFallback from "../../components/forms/NoDataFallback";
import { TbReceiptOff, TbReceiptPound } from "react-icons/tb";

type Props = {
  data: (Transaction & { currency: CurrencyState; receipt?: Receipt })[];
};

const TransactionsTable = ({ data }: Props) => {
  return (
    <>
      <table className="w-full text-left border-collapse">
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
              time,
              context,
              receipt,
            } = transaction;

            return (
              <tr
                key={id}
                className="border-b border-[#5152fb] hover:bg-[#f4f4ff] transition"
              >
                <td className="p-2">
                  <p className="flex flex-col">
                    <span>{date}</span>
                    <span className="text-xs">{time}</span>
                  </p>
                </td>
                <td className="p-2">{type}</td>
                <td className="p-2">{title}</td>
                <td className="p-2">
                  {currency?.symbol}
                  {amount.toFixed(2)}
                </td>
                <td className="p-2">{note?.trim() ? note : "-"}</td>
                <td className="p-2">
                  {!receipt ? (
                    <span
                      className={`flex gap-2 items-center ${
                        context === "BUSINESS"
                          ? "text-red-500"
                          : "text-blue-500"
                      }`}
                    >
                      <TbReceiptOff fontSize={20} /> Receipt missing
                    </span>
                  ) : receipt ? (
                    <Link to={receipt?.url} target="_blank">
                      <span className="flex gap-2 items-center text-black hover:text-[#5152fb]">
                        <TbReceiptPound fontSize={20} /> View Receipt
                      </span>
                    </Link>
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
      {!data?.length && <NoDataFallback dataType="business transactions" />}
    </>
  );
};

export default TransactionsTable;
