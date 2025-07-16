import type { EnrichedTransaction } from "./types/transactionTypes";
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
import type { PaymentMethod } from "./paymentMethods/types/paymentMethodsTypes";

type Props = {
  data: EnrichedTransaction[];
  paymentMethods: PaymentMethod[];
};

const TransactionGrid = ({ data, paymentMethods }: Props) => {
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
    <>
      <div className="w-full flex gap-4 py-4 mb-2 min-w-full overflow-x-auto">
        {paymentMethods?.map((paymentMethod: PaymentMethod) => {
          const mapOverBudgets = paymentMethod?.budgets?.map((budget) => {
            return (
              <p
                key={budget?.id}
                className="flex gap-2 items-center border border-gray-950 px-2 rounded-full text-black text-sm"
              >
                <span>{budget?.currencyId}</span>
                <span>{budget?.amount.toFixed(2)}</span>
              </p>
            );
          });
          return (
            <div
              key={paymentMethod?.id}
              className="min-w-fit border-2 rounded-lg shadow-md p-4 flex justify-between items-center gap-2 bg-white"
            >
              <p className="font-bold w-full min-w-[150px] mr-4">
                {paymentMethod?.name}
              </p>
              {mapOverBudgets}
            </div>
          );
        })}
      </div>
      <div className="w-full gap-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
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
              className="flex flex-1 border-2 flex-col justify-between items-stretch gap-4 bg-white rounded-lg p-4 shadow-md"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm flex items-center gap-2">
                  <FaCalendar className="min-w-[16px]" />
                  {createdDate} - {createdTime}
                </span>
              </div>
              <p className="font-bold">{title}</p>
              <p
                className={`inline-block ${
                  type === "EXPENSE" ? "text-red-600" : "text-green-600"
                } font-bold`}
              >
                {currency?.symbol}
                {amount.toFixed(2)}
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
                  <Link
                    to={`${receipt?.url}`}
                    target="_blank"
                    className={`${PRIMARY} ${SHARED}`}
                  >
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
    </>
  );
};

export default TransactionGrid;
