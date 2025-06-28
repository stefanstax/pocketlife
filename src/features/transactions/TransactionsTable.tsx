import type { TransactionList } from "./transactionTypes";
import { Link } from "react-router-dom";
import { PRIMARY, SHARED } from "../../app/globalClasses";
import NoDataFallback from "../../components/forms/NoDataFallback";
import { TbReceiptOff, TbReceiptPound } from "react-icons/tb";
import Button from "../../components/Button";
import { useDeleteTransactionMutation } from "./api/transactionsApi";
import { useState } from "react";

type Props = {
  data: TransactionList[];
};

const TransactionsTable = ({ data }: Props) => {
  const [deleteTransaction, { isLoading: transactionRemoving }] =
    useDeleteTransactionMutation();

  const [whoseBeingRemoved, setWhoseBeingRemoved] = useState<string | null>(
    null
  );

  const handleDelete = async (id: string) => {
    await deleteTransaction(id);
    setWhoseBeingRemoved(id);
  };

  return (
    <>
      <section className="w-full overflow-x-auto">
        <div className="overflow-y-auto rounded-sm">
          <table className="w-full table-auto text-left">
            <thead className="bg-black text-white sticky top-0 z-10">
              <tr>
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
                      <div className="flex flex-col">
                        <span>{date}</span>
                        <span className="text-xs">{time}</span>
                      </div>
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
                      ) : (
                        <Link to={receipt?.url} target="_blank">
                          <span className="flex gap-2 items-center text-black hover:text-[#5152fb]">
                            <TbReceiptPound fontSize={20} /> View Receipt
                          </span>
                        </Link>
                      )}
                    </td>
                    <td className="p-2 grid grid-cols-2 gap-2">
                      <Link
                        className={`${PRIMARY} ${SHARED}`}
                        to={`http://localhost:5173/transactions/${id}`}
                      >
                        Edit
                      </Link>
                      <Button
                        type="button"
                        variant="PRIMARY"
                        ariaLabel="Delete transaction"
                        onClick={() => handleDelete(id)}
                      >
                        {transactionRemoving && whoseBeingRemoved === id
                          ? "Deleting..."
                          : "Delete"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      {!data?.length && <NoDataFallback dataType="business transactions" />}
    </>
  );
};

export default TransactionsTable;
