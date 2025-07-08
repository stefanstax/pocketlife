import type { EnrichedTransaction } from "./transactionTypes";
import { Link } from "react-router-dom";
import { PRIMARY, SHARED } from "../../app/globalClasses";
import Button from "../../components/Button";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import {
  FaCalendar,
  FaCreditCard,
  FaNoteSticky,
  FaReceipt,
  FaRegClone,
  FaUserTie,
} from "react-icons/fa6";

import {
  useAddTransactionMutation,
  useDeleteTransactionMutation,
} from "./api/transactionsApi";
import { toast } from "react-toastify";
import { useGetPaymentMethodsQuery } from "./paymentMethods/api/paymentMethodsApi";

type Props = {
  data: EnrichedTransaction[];
};

const TransactionGrid = ({ data }: Props) => {
  const [deleteTransaction] = useDeleteTransactionMutation();
  const { data: paymentMethods } = useGetPaymentMethodsQuery();

  const [addTransaction] = useAddTransactionMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      toast.success("Transaction was deleted.");
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Uncaught error. Check console.");
    }
  };

  const handleClone = async (transaction: EnrichedTransaction) => {
    const { currency, paymentMethod, id, ...rest } = transaction;
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

  return (
    <div className="w-full h-[400px] overflow-y-auto lg:h-full gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      <div className="w-full col-span-5 flex gap-2 mb-2">
        {paymentMethods?.map((paymentMethod) => {
          const mapOverBudgets = paymentMethod?.budgets?.map((budget) => {
            return (
              <p className="text-sm">
                {budget?.currencyId} - {budget?.amount}
              </p>
            );
          });
          return (
            <div className="bg-gray-950 rounded-lg p-2 my-2 text-white min-w-[200px]">
              <p className="font-bold">{paymentMethod?.name}</p>
              {mapOverBudgets}
            </div>
          );
        })}
      </div>
      {data.map((transaction) => {
        const {
          title,
          amount,
          note,
          type,
          currency,
          receipt,
          paymentMethod,
          created_at,
          context,
        } = transaction;

        const createdDate = new Date(created_at).toLocaleDateString();
        const createdTime = new Date(created_at).toLocaleTimeString();
        return (
          <div
            key={transaction?.id}
            className="flex flex-col justify-between items-stretch gap-4 bg-gray-950 rounded-lg text-white p-4 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm flex items-center gap-2">
                <FaCalendar className="min-w-[16px]" />
                {createdDate} - {createdTime}
              </span>
            </div>
            <p className="font-bold">{title}</p>
            <p
              className={`${
                type === "EXPENSE"
                  ? "text-red-500"
                  : type === "SAVINGS"
                  ? "text-blue-500"
                  : "text-green-500"
              } font-bold`}
            >
              {currency?.symbol}
              {amount}
            </p>
            <p className="text-sm font-bold flex items-center gap-2">
              <FaUserTie className="min-w-[16px]" />
              {context}
            </p>
            <p className="flex items-center gap-2 text-sm">
              <FaCreditCard className="min-w-[16px]" />
              {paymentMethod?.name}
            </p>
            <p className="text-sm flex items-center gap-2">
              <FaNoteSticky className="min-w-[16px]" />
              {note?.length ? note : "Note not provided."}
            </p>
            <div className="grid gap-4 grid-cols-4 border-t-1 border-gray-900 pt-4">
              <Link
                className={`${PRIMARY} ${SHARED}`}
                to={`/transactions/${transaction?.id}`}
              >
                <FiEdit2 className="min-w-[16px]" />
              </Link>
              <Button
                type="button"
                ariaLabel="Edit transaction"
                variant="PRIMARY"
                onClick={() => handleClone(transaction)}
              >
                <FaRegClone className="min-w-[16px]" />
              </Button>
              <Button
                type="button"
                ariaLabel="Edit transaction"
                variant="PRIMARY"
                onClick={() => handleDelete(transaction?.id)}
              >
                <AiOutlineDelete className="min-w-[16px]" />
              </Button>
              {receipt?.url ? (
                <Link to={`${receipt?.url}`} className={`${PRIMARY} ${SHARED}`}>
                  <FaReceipt />
                </Link>
              ) : (
                <p
                  className={`${PRIMARY} ${SHARED} opacity-50 pointer-events-none`}
                >
                  <FaReceipt className={"min-w-[16px]"} />
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TransactionGrid;
