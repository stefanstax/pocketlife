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
              type="button"
              key={option.id}
              className={`text-sm  ${
                option.id === paymentMethodId ? "bg-[#010d18] text-white " : ""
              } min-w-[100px] cursor-pointer p-2 `}
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
