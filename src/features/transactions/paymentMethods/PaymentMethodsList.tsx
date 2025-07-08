import {
  useDeletePaymentMethodMutation,
  useGetPaymentMethodsQuery,
} from "./api/paymentMethodsApi";
import { Link } from "react-router";
import Button from "../../../components/Button";
import { PRIMARY, SHARED } from "../../../app/globalClasses";

const PaymentMethodsList = () => {
  const { data } = useGetPaymentMethodsQuery();
  const [deletePaymentMethod] = useDeletePaymentMethodMutation();
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data?.map((paymentMethod) => {
        const { id, name, type, budgets } = paymentMethod;
        return (
          <div
            key={name}
            className="bg-gray-950 text-white rounded-lg p-4 flex flex-col gap-4"
          >
            <p className="text-sm text-orange-300">#{type?.toUpperCase()}</p>
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
  );
};

export default PaymentMethodsList;
