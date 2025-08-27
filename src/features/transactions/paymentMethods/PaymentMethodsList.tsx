import { useDeletePaymentMethodMutation } from "./api/paymentMethodsApi";
import { Link } from "react-router";
import Button from "../../../components/Button";
import { PRIMARY, SHARED } from "../../../app/globalClasses";
import NoDataFallback from "../../../components/forms/NoDataFallback";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";

const PaymentMethodsList = () => {
  const [deletePaymentMethod] = useDeletePaymentMethodMutation();
  const { user } = useSelector((state: RootState) => state.auth);

  const paymentMethods = user?.paymentMethods;

  return (
    <>
      {paymentMethods && paymentMethods?.length > 0 ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paymentMethods?.map((paymentMethod) => {
            const { id, name, type, budgets } = paymentMethod;
            return (
              <div
                key={id}
                className="bg-white border-2 rounded-lg shadow-md p-4 flex flex-col gap-4"
              >
                <p className="text-sm text-gray-950 border-1 w-fit px-2 rounded-full">
                  {type?.toUpperCase()}
                </p>
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
                <div className="w-full grid grid-cols-2 gap-4 border-t border-gray-800 pt-4">
                  <Link
                    className={`${PRIMARY} ${SHARED}`}
                    to={`/payment-methods/${id}`}
                  >
                    <FiEdit2 />
                  </Link>
                  <Button
                    ariaLabel="Delete payment method"
                    variant="PRIMARY"
                    onClick={() => deletePaymentMethod(id)}
                  >
                    <AiOutlineDelete />
                  </Button>
                </div>
              </div>
            );
          })}
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
