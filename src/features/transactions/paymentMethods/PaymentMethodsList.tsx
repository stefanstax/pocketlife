import { useSelector } from "react-redux";
import {
  useDeletePaymentMethodMutation,
  useGetPaymentMethodsQuery,
} from "./api/paymentMethodsApi";
import type { RootState } from "../../../app/store";
import { Link } from "react-router";
import Button from "../../../components/Button";
import { PRIMARY, SHARED } from "../../../app/globalClasses";

const PaymentMethodsList = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const { data } = useGetPaymentMethodsQuery(user?.id ?? "");
  const [deletePaymentMethod] = useDeletePaymentMethodMutation();
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data?.map((paymentMethod) => {
        return (
          <div
            key={paymentMethod?.name}
            className="bg-gray-950 text-white rounded-lg p-4 flex flex-col gap-4"
          >
            <p className="text-sm text-orange-300">
              #{paymentMethod?.type?.toUpperCase()}
            </p>
            <p className="text-2xl font-bold">{paymentMethod?.name}</p>
            <div className="w-full grid grid-cols-2 gap-4">
              <Link
                className={`${PRIMARY} ${SHARED}`}
                to={`/payment-methods/${paymentMethod?.id}`}
              >
                Edit
              </Link>
              <Button
                ariaLabel="Delete payment method"
                variant="PRIMARY"
                onClick={() => deletePaymentMethod(paymentMethod?.id)}
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
