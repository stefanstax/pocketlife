import { formDiv, input, labelClasses } from "../../../app/globalClasses";
import FormError from "../../../components/FormError";
import { useGetPaymentMethodsQuery } from "../paymentMethods/api/paymentMethodsApi";

const TransactionMethod = ({
  paymentMethodId,
  setPaymentMethodId,
  validationError,
}: {
  userId: string;
  paymentMethodId: string | "";
  setPaymentMethodId: (value: string) => void;
  validationError?: string;
}) => {
  const { data } = useGetPaymentMethodsQuery();

  return (
    <div className={formDiv}>
      <label className={labelClasses} htmlFor="method">
        Method
      </label>
      <div className={`${input} flex flex-wrap gap-2`}>
        {data?.map((option) => {
          return (
            <button
              key={option.id}
              className={`text-sm font-[600] ${
                option.id === paymentMethodId
                  ? "bg-gray-950 text-white border-black"
                  : ""
              } min-w-[100px] rounded-full cursor-pointer p-2 border-black border-solid border-1`}
              type="button"
              onClick={() => setPaymentMethodId(option.id)}
            >
              {option.name.toUpperCase()}
            </button>
          );
        })}
      </div>
      <input
        type="hidden"
        name="paymentMethodId"
        value={paymentMethodId ?? ""}
        className={input}
      />
      {validationError && <FormError fieldError={validationError} />}
    </div>
  );
};

export default TransactionMethod;
