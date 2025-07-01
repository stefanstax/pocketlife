import type { TransactionWithCurrency } from "./transactionTypes";
import { Link } from "react-router-dom";
import { PRIMARY, SHARED } from "../../app/globalClasses";
import NoDataFallback from "../../components/forms/NoDataFallback";
import { TbReceiptOff, TbReceiptPound } from "react-icons/tb";
import Button from "../../components/Button";
import {
  useAddTransactionMutation,
  useDeleteTransactionMutation,
} from "./api/transactionsApi";

type Props = {
  data: TransactionWithCurrency[];
};

const TransactionsTable = ({ data }: Props) => {
  const [deleteTransaction] = useDeleteTransactionMutation();

  const [addTransaction] = useAddTransactionMutation();

  const handleDelete = async (id: string) => {
    await deleteTransaction(id);
  };

  const handleClone = async (transaction: TransactionWithCurrency) => {
    const { currency, id, ...rest } = transaction;
    const clonedTransaction = {
      ...rest,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      receipt: undefined,
    };

    try {
      await addTransaction(clonedTransaction);
    } catch (error: any) {
      console.log(error?.data?.message ?? "Uncaught error.");
    }
  };

  const tableColumnPadding = "py-2";

  return (
    <>
      <div className="w-full overflow-x-auto rounded-sm">
        <table className="w-full table-auto">
          <thead className="bg-blue-200 text-black sticky top-0 z-10">
            <tr>
              <th className={`${tableColumnPadding} min-w-[200px]`}>Actions</th>
              <th className={`${tableColumnPadding} min-w-[200px]`}>Date</th>
              <th className={`${tableColumnPadding} min-w-[200px]`}>Type</th>
              <th className={`${tableColumnPadding} min-w-[200px]`}>Title</th>
              <th className={`${tableColumnPadding} min-w-[200px]`}>Amount</th>
              <th className={`${tableColumnPadding} min-w-[200px]`}>Note</th>
              <th className={`${tableColumnPadding} min-w-[200px]`}>Receipt</th>
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
                  <td className={`${tableColumnPadding} flex flex-wrap gap-2`}>
                    <Link
                      className={`${PRIMARY} ${SHARED}`}
                      to={`${import.meta.env.VITE_WEB_URL}/transactions/${id}`}
                    >
                      Edit
                    </Link>
                    <Button
                      type="button"
                      variant="PRIMARY"
                      ariaLabel="Delete transaction"
                      onClick={() => handleDelete(id)}
                    >
                      Delete
                    </Button>
                    <Button
                      type="button"
                      variant="PRIMARY"
                      ariaLabel="Clone transaction"
                      onClick={() => handleClone(transaction)}
                    >
                      Clone
                    </Button>
                  </td>
                  <td className={`${tableColumnPadding}`}>
                    <div className="flex flex-col">
                      <span>{date}</span>
                      <span className="text-xs">{time}</span>
                    </div>
                  </td>
                  <td className={`${tableColumnPadding}`}>{type}</td>
                  <td className={`${tableColumnPadding}`}>{title}</td>
                  <td className={`${tableColumnPadding}`}>
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
