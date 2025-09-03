import { lazy, Suspense, useState } from "react";
import type { EnrichedTransaction } from "./types/transactionTypes";
import { Link } from "react-router-dom";
import { SECONDARY, SHARED, TERTIARY } from "../../app/globalClasses";
import Button from "../../components/Button";

// Icons
import { FaCalendar } from "@react-icons/all-files/fa/FaCalendar";
import { FaCreditCard } from "@react-icons/all-files/fa/FaCreditCard";
import { FaStickyNote } from "@react-icons/all-files/fa/FaStickyNote";
import { FaReceipt } from "@react-icons/all-files/fa/FaReceipt";
import { FaClone } from "@react-icons/all-files/fa/FaClone";
import { FaUserTie } from "@react-icons/all-files/fa/FaUserTie";
import { FaPen } from "@react-icons/all-files/fa/FaPen";
import { FaTrash } from "@react-icons/all-files/fa/FaTrash";

// Redux
import {
  useAddTransactionMutation,
  useDeleteTransactionMutation,
} from "./api/transactionsApi";

import { toast } from "react-toastify";

import type { PaymentMethod } from "./paymentMethods/types/paymentMethodsTypes";
import DataSpinner from "../../components/DataSpinner";
import type { CategoryType } from "./category/types/categoryType";
import DeleteRecordModal from "../../components/DeleteRecordModal";
const IconShowcase = lazy(() =>
  import("../../components/IconPicker").then((module) => ({
    default: module.IconShowcase,
  }))
);
type Props = {
  data: EnrichedTransaction[];
  paymentMethods: PaymentMethod[];
  categories: CategoryType[];
};

const TransactionGrid = ({ data, paymentMethods, categories }: Props) => {
  const [deleteTransaction] = useDeleteTransactionMutation();

  const [showDeleteModal, setShowDeleteModal] = useState<{
    show: boolean;
    itemId: string | null;
    itemTitle: string | null;
  }>({
    show: false,
    itemId: null,
    itemTitle: "",
  });

  const [addTransaction] = useAddTransactionMutation();

  const handleDelete = async (id: string) => {
    const toastId = toast.info("Transaction is being deleted...");
    try {
      await deleteTransaction(id);
      toast.update(toastId, {
        render: "Transaction has been deleted",
        type: "success",
        autoClose: 5000,
        isLoading: false,
      });
    } catch (error: any) {
      toast.update(toastId, {
        render: error?.data?.message ?? "Uncaught error.",
        type: "error",
        autoClose: 5000,
        isLoading: false,
      });
    }
  };

  const handleClone = async (transaction: EnrichedTransaction) => {
    const {
      id,
      receipt,
      currency,
      paymentMethod,
      created_at,
      updated_at,
      ...rest
    } = transaction;

    const revisedData = {
      ...rest,
      id: undefined,
      receipt: undefined,
      updated_at: undefined,
      created_at: new Date().toISOString(),
    };
    const toastId = toast.info("Transaction is being cloned...");
    try {
      await addTransaction(revisedData).unwrap();
      toast.update(toastId, {
        render: "Transaction has been cloned.",
        type: "success",
        autoClose: 5000,
        isLoading: false,
      });
    } catch (error: any) {
      return toast.update(toastId, {
        render: error?.data?.message ?? "Uncaught error.",
        type: "error",
        autoClose: 5000,
        isLoading: false,
      });
    }
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
            categoryId,
            paymentMethod,
            created_at,
            context,
          } = transaction;

          const createdDate = new Date(created_at).toLocaleDateString();
          const createdTime = new Date(created_at).toLocaleTimeString();
          const findIcon = categories?.find(
            (category) => category?.id === categoryId
          );
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
              <div className="flex flex-wrap font-[600] gap-2 items-center">
                <p>{title}</p>
                <Suspense fallback={<DataSpinner />}>
                  {findIcon && (
                    <span
                      className="flex gap-2 items-center text-xs border-1
                  rounded-full 
                  px-2
                  py-1"
                    >
                      <IconShowcase pickedIcon={findIcon?.icon ?? ""} />
                      <span>{findIcon?.name}</span>
                    </span>
                  )}
                </Suspense>
              </div>
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
                <FaStickyNote className="min-w-[16px]" />
                {note?.length ? note : "Note not provided."}
              </p>
              <div className="grid gap-4 grid-cols-2 border-t-1 border-gray-900 pt-4">
                <Link
                  className={`${SECONDARY} ${SHARED}`}
                  to={`/transactions/${transaction?.id}`}
                >
                  Update <FaPen className="min-w-[16px]" />
                </Link>
                <Button
                  type="button"
                  ariaLabel="Delete transaction"
                  variant="DANGER"
                  onClick={() =>
                    setShowDeleteModal({
                      show: true,
                      itemId: transaction?.id,
                      itemTitle: transaction?.title,
                    })
                  }
                >
                  Delete <FaTrash className="min-w-[16px]" />
                </Button>
                {receipt?.url ? (
                  <Link
                    to={`${receipt?.url}`}
                    target="_blank"
                    className={`${TERTIARY} ${SHARED}`}
                  >
                    View <FaReceipt />
                  </Link>
                ) : (
                  <p
                    className={`${TERTIARY} ${SHARED} opacity-50 pointer-events-none`}
                  >
                    No Receipt
                  </p>
                )}
                <Button
                  type="button"
                  ariaLabel="Clone transaction"
                  variant="TERTIARY"
                  onClick={() => handleClone(transaction)}
                >
                  Clone <FaClone className="min-w-[16px]" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <DeleteRecordModal
        itemId={showDeleteModal?.itemId}
        itemTitle={showDeleteModal?.itemTitle}
        showModal={showDeleteModal?.show}
        onCancel={() =>
          setShowDeleteModal({ show: false, itemId: null, itemTitle: null })
        }
        deleteFn={() => handleDelete(showDeleteModal?.itemId)}
      />
    </>
  );
};

export default TransactionGrid;
