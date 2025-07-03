import type { TransactionWithCurrency } from "./transactionTypes";
import { Link } from "react-router-dom";
import { PRIMARY, SHARED } from "../../app/globalClasses";
import NoDataFallback from "../../components/forms/NoDataFallback";
import { TbReceiptOff, TbReceiptPound } from "react-icons/tb";
import Button from "../../components/Button";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { FaRegClone } from "react-icons/fa6";

import {
  useAddTransactionMutation,
  useDeleteTransactionMutation,
} from "./api/transactionsApi";
import { toast } from "react-toastify";

type Props = {
  data: TransactionWithCurrency[];
};

const TransactionsTable = ({ data }: Props) => {
  const [deleteTransaction] = useDeleteTransactionMutation();

  const [addTransaction] = useAddTransactionMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      toast.success("Transaction was deleted.");
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Uncaught error. Check console.");
    }
  };

  const handleClone = async (transaction: TransactionWithCurrency) => {
    const { currency, id, ...rest } = transaction;
    const clonedTransaction = {
      ...rest,
      receipt: undefined,
    };

    await toast.promise(addTransaction(clonedTransaction), {
      pending: "Transaction is being cloned.",
      success: "Transaction has been cloned.",
      error: "Transaction could not be cloned.",
    });
  };

  const tableColumnPadding = "p-4";

  return (
    <>
      <div className="w-full overflow-x-auto rounded-sm">
        <table className="w-full table-auto">
          <thead className="bg-blue-50 text-[#5152fb] sticky top-0 z-10">
            <tr>
              <th className={`${tableColumnPadding} min-w-[200px]`}>Actions</th>
              <th className={`${tableColumnPadding} min-w-[200px]`}>
                What was charged
              </th>
              <th className={`${tableColumnPadding} min-w-[200px]`}>
                How much
              </th>
              <th className={`${tableColumnPadding} min-w-[200px]`}>Note</th>
              <th className={`${tableColumnPadding} min-w-[200px]`}>
                Receipt/Invoice
              </th>
              <th className={`${tableColumnPadding} min-w-[200px]`}>
                Created/Updated
              </th>
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
                created_at,
                updated_at,
                context,
                receipt,
              } = transaction;

              const createdDate = new Date(created_at).toLocaleDateString();
              const createdTime = new Date(created_at).toLocaleTimeString();
              const updatedDate = new Date(updated_at).toLocaleDateString();
              const updatedTime = new Date(updated_at).toLocaleTimeString();

              return (
                <tr
                  key={id}
                  className="border-b text-center border-[#5152fb] hover:bg-[#f4f4ff] transition"
                >
                  <td
                    className={`${tableColumnPadding} grid grid-cols-3 gap-2`}
                  >
                    <Link
                      className={`${PRIMARY} ${SHARED} `}
                      to={`${import.meta.env.VITE_WEB_URL}/transactions/${id}`}
                    >
                      <FiEdit2 />
                    </Link>
                    <Button
                      type="button"
                      variant="PRIMARY"
                      ariaLabel="Delete transaction"
                      onClick={() => handleDelete(id)}
                    >
                      <AiOutlineDelete />
                    </Button>
                    <Button
                      type="button"
                      variant="PRIMARY"
                      ariaLabel="Clone transaction"
                      onClick={() => handleClone(transaction)}
                    >
                      <FaRegClone />
                    </Button>
                  </td>

                  <td className={`${tableColumnPadding}`}>{title}</td>
                  <td
                    className={`${tableColumnPadding} ${
                      type === "EXPENSE" ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {currency?.symbol}
                    {amount.toFixed(2)}
                  </td>
                  <td className={`${tableColumnPadding}`}>
                    {note?.trim() ? note : "-"}
                  </td>
                  <td className={`${tableColumnPadding}`}>
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
                  <td className={`${tableColumnPadding}`}>
                    <span className="flex items-center gap-1">
                      {createdDate} - {createdTime}
                    </span>
                    <span
                      className={`${
                        updatedDate === "01/01/1970" ? "hidden" : "flex"
                      } items-center gap-1`}
                    >
                      {updatedDate} -{updatedTime}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!data?.length && <NoDataFallback dataType="Transactions" />}
    </>
  );
};

export default TransactionsTable;
