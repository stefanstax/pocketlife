import {
  useDeletePaymentMethodMutation,
  useGetPaymentMethodsQuery,
} from "./api/paymentMethodsApi";
import { Link } from "react-router";
import Button from "../../../components/Button";
import { PRIMARY, SHARED } from "../../../app/globalClasses";
import NoDataFallback from "../../../components/forms/NoDataFallback";
import { useState } from "react";
import DeleteRecordModal from "../../../components/DeleteRecordModal";
import { toast } from "react-toastify";
import BlurredSpinner from "../../../components/BlurredSpinner";

const PaymentMethodsList = () => {
  const [deletePaymentMethod] = useDeletePaymentMethodMutation();
  // const { user } = useSelector((state: RootState) => state.auth);

  // const paymentMethods = user?.paymentMethods;
  const { data: paymentMethods, isLoading } = useGetPaymentMethodsQuery();

  const [showDeleteModal, setShowDeleteModal] = useState<{
    show: boolean;
    itemId: string | null;
    itemTitle: string | null;
  }>({
    show: false,
    itemId: null,
    itemTitle: "",
  });

  const handleDelete = async (id: string) => {
    const toastId = toast.info(
      `${showDeleteModal?.itemTitle} is being deleted...`
    );
    try {
      await deletePaymentMethod(id);
      setShowDeleteModal({
        show: false,
        itemId: null,
        itemTitle: null,
      });
      toast.update(toastId, {
        render: `${showDeleteModal?.itemTitle} has been deleted`,
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

  if (isLoading) return <BlurredSpinner />;

  return (
    <>
      {paymentMethods && paymentMethods?.length > 0 ? (
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
          {paymentMethods?.map((paymentMethod) => {
            const { id, name, type, budgets } = paymentMethod;
            return (
              <div
                key={id}
                className="bg-[#2A2B3D] text-white p-4 flex flex-col gap-4"
              >
                <p className="text-xs w-fit">{type?.toUpperCase()}</p>
                <p className="text-2xl font-bold">{name}</p>
                {budgets && (
                  <div className="flex items-center gap-2">
                    <p>Balance: </p>
                    {budgets.map((budget) => {
                      return (
                        <p key={budget?.id}>
                          {budget?.currencyId}
                          {budget?.amount.toFixed(2)}
                        </p>
                      );
                    })}
                  </div>
                )}
                <div className="w-full grid grid-cols-2 gap-4">
                  <Link
                    className={`${PRIMARY} ${SHARED}`}
                    to={`/payment-methods/${id}`}
                  >
                    Edit
                  </Link>
                  <Button
                    ariaLabel="Delete payment method"
                    variant="DANGER"
                    onClick={() =>
                      setShowDeleteModal({
                        show: true,
                        itemId: id,
                        itemTitle: name,
                      })
                    }
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
          <DeleteRecordModal
            itemId={showDeleteModal?.itemId}
            itemTitle={showDeleteModal?.itemTitle}
            showModal={showDeleteModal?.show}
            onCancel={() =>
              setShowDeleteModal({ show: false, itemId: null, itemTitle: null })
            }
            deleteFn={() => handleDelete(showDeleteModal?.itemId)}
          />
        </div>
      ) : (
        <NoDataFallback
          dataType="payment methods"
          goTo="/payment-methods/add"
        />
      )}
    </>
  );
};

export default PaymentMethodsList;
