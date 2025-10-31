import { lazy, Suspense, useState } from "react";
import type { EnrichedTransaction } from "./types/transactionTypes";
import { Link } from "react-router-dom";

// Icons
import { FaReceipt } from "@react-icons/all-files/fa/FaReceipt";
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
import useWindowSize from "../../hooks/useWindowSize";
import { FaEdit, FaRegClone } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { openOverview } from "../../app/overviewSlice";

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

const TransactionGrid = ({ data, categories }: Props) => {
  const [deleteTransaction] = useDeleteTransactionMutation();
  const dispatch = useDispatch();

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
      <div className="w-full grid grid-cols-1">
        {data.map((transaction) => {
          const {
            invoiceNumber,
            title,
            amount,
            fee,
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
              <div className="flex bg-[#2A2B3D] justify-between w-full p-4 text-xs items-center border-b-1 border-b-[#33344A]">
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
                  <button
                    className="flex gap-2 items-center text-white cursor-pointer"
                    onClick={() => {
                      dispatch(
                        openOverview({
                          name: "transactionPanel",
                          panelId: transaction?.id,
                          transactionOverview: true,
                          data: transaction,
                        })
                      );
                    }}
                  >
                    <FaEdit className="min-w-[16px]" />
                  </button>

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
              <div className="flex flex-wrap justify-between items-center gap-4 bg-[#2A2B3D] text-white p-4">
                {/* Transaction Who */}
                {width > 1024 && (
                  <p className="flex flex-col">
                    <span className="text-xs">{invoiceNumber}</span>
                    {title}
                  </p>
                )}
                {/* Transaction Date */}
                {width > 1024 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm flex items-center gap-2">
                      {createdDate}
                    </span>
                  </div>
                )}
                {/* Transaction Account */}
                {width > 1024 && (
                  <p className="flex flex-col items-start gap-2 text-sm">
                    <span className="text-xs">{context}</span>
                    {paymentMethod?.name}
                  </p>
                )}
                {width <= 1024 && (
                  <div className="flex flex-col gap-2 flex-1">
                    <p className="flex flex-col">
                      <span className="text-xs">{invoiceNumber}</span>
                      {title}
                    </p>
                    <p className="text-sm">{createdDate}</p>
                    <p className="text-sm">{context}</p>
                  </div>
                )}
                {/* Transaction Amount */}
                <p className="text-sm">
                  <span className="flex justify-end">
                    Net {currency?.symbol}
                    {amount.toFixed(2)}
                  </span>
                  <span className="flex justify-end">
                    Gross {currency?.symbol}
                    {(amount + fee).toFixed(2)}
                  </span>
                </p>
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
