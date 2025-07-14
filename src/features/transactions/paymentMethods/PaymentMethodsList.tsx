import {
  useDeletePaymentMethodMutation,
  useGetPaymentMethodsQuery,
} from "./api/paymentMethodsApi";
import { Link } from "react-router";
import Button from "../../../components/Button";
import { PRIMARY, SHARED } from "../../../app/globalClasses";
import BlurredSpinner from "../../../components/BlurredSpinner";
import NoDataFallback from "../../../components/forms/NoDataFallback";

const PaymentMethodsList = () => {
  const [deletePaymentMethod] = useDeletePaymentMethodMutation();
  const { data, isLoading } = useGetPaymentMethodsQuery();

  if (isLoading) return <BlurredSpinner />;

  return (
    <>
      {data && data?.length > 0 ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.map((paymentMethod) => {
            const { id, name, type, budgets } = paymentMethod;
            return (
              <div
                key={name}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-4"
              >
                <p className="text-sm text-cyan-950 font-black">
                  #{type?.toUpperCase()}
                </p>
                <p className="text-2xl font-bold">{name}</p>
                {budgets && (
                  <div className="flex items-center gap-2">
                    <p>Balance: </p>
                    {budgets.map((budget) => {
                      return (
                        <p>
                          {budget?.currencyId}
                          {budget?.amount}
                        </p>
                      );
                    })}
                  </div>
                )}
                <div className="w-full grid grid-cols-2 gap-4 border-t border-gray-800 pt-4">
                  <Link
                    className={`${PRIMARY} ${SHARED}`}
                    to={`/payment-methods/${id}`}
                  >
                    Edit
                  </Link>
                  <Button
                    ariaLabel="Delete payment method"
                    variant="PRIMARY"
                    onClick={() => deletePaymentMethod(id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <NoDataFallback dataType="payment methods" />
      )}
    </>
  );
};

export default PaymentMethodsList;
