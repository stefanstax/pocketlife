import { lazy, Suspense, useState } from "react";
import type { EnrichedTransaction } from "./types/transactionTypes";
import { Link } from "react-router-dom";

// Icons
import { FaCreditCard } from "@react-icons/all-files/fa/FaCreditCard";
import { FaReceipt } from "@react-icons/all-files/fa/FaReceipt";
import { FaRegClone } from "@react-icons/all-files/fa/FaRegClone";
import { FaUserTie } from "@react-icons/all-files/fa/FaUserTie";
import { FaEdit } from "@react-icons/all-files/fa/FaEdit";
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
import useWindowSize from "../../components/ScreenSize";
import { FaStickyNote } from "react-icons/fa";
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
      {/* <div className="w-full flex gap-4 py-4 mb-2 min-w-full overflow-x-auto">
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
              className="min-w-fit border-2 rounded-lg shadow-md p-4 flex justify-between items-center gap-2 bg-[#202d37] text-white"
            >
              <p className="font-bold w-full min-w-[150px] mr-4">
                {paymentMethod?.name}
              </p>
              {mapOverBudgets}
            </div>
          );
        })}
      </div> */}
      <div className="w-full grid grid-cols-1">
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

          const createdDate = new Date(created_at).toDateString();
          const findIcon = categories?.find(
            (category) => category?.id === categoryId
          );

          const { width } = useWindowSize();
          return (
            <div key={transaction?.id} className="mb-4">
              {/* Transaction Category */}
              <div className="flex bg-[#1a2630] justify-between w-full p-4 text-xs items-center">
                <Suspense fallback={<DataSpinner />}>
                  {findIcon && (
                    <span className="flex gap-2 text-white items-center">
                      <IconShowcase pickedIcon={findIcon?.icon ?? ""} />
                      <span>{findIcon?.name}</span>
                    </span>
                  )}
                </Suspense>
                <div className="flex gap-2 lg:gap-6 items-center">
                  <button
                    className="flex gap-2 items-center text-white cursor-pointer"
                    onClick={() => handleClone(transaction)}
                  >
                    <FaRegClone className="min-w-[16px]" />
                  </button>
                  <Link
                    className={`flex gap-2 items-center text-white cursor-pointer`}
                    to={`/transactions/${transaction?.id}`}
                  >
                    <FaEdit className="min-w-[16px]" />
                  </Link>
                  <button
                    className="flex gap-2 items-center text-white hover:text-red-800 cursor-pointer"
                    onClick={() =>
                      setShowDeleteModal({
                        show: true,
                        itemId: transaction?.id,
                        itemTitle: transaction?.title,
                      })
                    }
                  >
                    <FaTrash className="min-w-[16px]" />
                  </button>

                  {receipt?.url ? (
                    <Link
                      to={`${receipt?.url}`}
                      target="_blank"
                      className="text-white"
                    >
                      <FaReceipt />
                    </Link>
                  ) : (
                    <p className="text-white">
                      <FaReceipt className={"min-w-[16px]"} />
                    </p>
                  )}
                </div>
              </div>
              {/* Main Transaction Part */}
              <div className="flex flex-wrap justify-between items-center gap-4 bg-[#202d37] text-white p-4">
                {/* Transaction Who */}
                {width > 1024 && <p>{title}</p>}
                {/* Transaction Date */}
                {width > 1024 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm flex items-center gap-2">
                      {createdDate}
                    </span>
                  </div>
                )}

                {/* Transaction Context */}
                {width > 1024 && (
                  <p className="text-sm font-bold flex items-center gap-2">
                    <FaUserTie className="min-w-[16px]" />
                    {context}
                  </p>
                )}

                {/* Transaction Account */}
                {width > 1024 && (
                  <p className="flex items-center gap-2 text-sm">
                    <FaCreditCard className="min-w-[16px]" />
                    {paymentMethod?.name}
                  </p>
                )}

                {width <= 1024 && (
                  <div className="flex flex-col gap-2">
                    <p className="font-bold">{title}</p>
                    <p className="text-sm">{createdDate}</p>
                    <p className="text-sm">{context}</p>
                  </div>
                )}
                {/* Transaction Note - Show in Transaction overview*/}
                {/* {width > 1024 && (
                  <p className="text-sm flex items-center gap-2">
                    <FaStickyNote className="min-w-[16px]" />
                    {note?.length ? note : "Note not provided."}
                  </p>
                )} */}
                {/* Transaction Amount */}
                <p className="text-md font-bold">
                  {currency?.symbol}
                  {amount.toFixed(2)}
                </p>
                {/* Actions */}
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
