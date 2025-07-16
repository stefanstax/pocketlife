import { useState, type FormEvent } from "react";
import { transactionSchema } from "./schemas/transactionSchemas";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import {
  type Receipt,
  type Transaction,
  type TransactionContexts,
  type TransactionTypes,
} from "./types/transactionTypes";
import SubmitButton from "../../components/SubmitButton";
// Form Fields
import TransactionTitle from "./fields/TransactionTitle";
import TransactionAmount from "./fields/TransactionAmount";
import TransactionType from "./fields/TransactionType";
import TransactionCurrency from "./fields/TransactionCurrency";
import TransactionContext from "./fields/TransactionContext";
import TransactionNote from "./fields/TransactionNote";
import { useAddTransactionMutation } from "./api/transactionsApi";
import UploadField from "../../components/forms/UploadFile";
import { toast } from "react-toastify";
import TransactionMethod from "./fields/TransactionMethod";
import { useDispatch } from "react-redux";
import {
  addAmount,
  substractAmount,
} from "./paymentMethods/api/paymentMethodsSlice";
import { useGetPaymentMethodByIdQuery } from "./paymentMethods/api/paymentMethodsApi";

const TransactionAdd = () => {
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<number | "">("");
  const [context, setContext] = useState<TransactionContexts | "">("");
  const [currencyId, setCurrencyId] = useState<string | "">("");
  const [note, setNote] = useState<string>("");
  const [type, setType] = useState<TransactionTypes | "">("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<string | "">("");
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>(
    {}
  );

  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const [addTransaction, { isLoading: creatingTransaction }] =
    useAddTransactionMutation();

  const { data: paymentMethod } = useGetPaymentMethodByIdQuery(
    paymentMethodId ?? ""
  );

  const findBudget = paymentMethod?.budgets?.find(
    (budgetId) => budgetId?.currencyId === currencyId
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const verifiedData = transactionSchema.safeParse({
      title: formData.get("title"),
      amount: formData.get("amount"),
      currencyId: formData.get("currencyId"),
      created_at: new Date().toISOString(),
      updated_at: null,
      note: formData.get("note"),
      type: formData.get("type"),
      paymentMethodId: formData.get("paymentMethodId"),
      budgetId: findBudget?.id,
      context: formData.get("context"),
      receipt: receipt,
      userId: user?.id,
    });

    if (!verifiedData.success) {
      const flattened = verifiedData.error.flatten();
      const fieldErrors = Object.fromEntries(
        Object.entries(flattened.fieldErrors).map(([key, val]) => [
          key,
          val?.[0],
        ])
      );
      setFormErrors(fieldErrors);

      return;
    }

    if (verifiedData.success) {
      try {
        if (type === "EXPENSE") {
          dispatch(
            substractAmount({
              budgetId: findBudget?.id as string,
              currencyId,
              amount: +amount,
            })
          );
        } else {
          dispatch(
            addAmount({
              budgetId: findBudget?.id as string,
              currencyId,
              amount: +amount,
            })
          );
        }

        await addTransaction(verifiedData.data as Transaction).unwrap();

        toast.success("Transaction has been created.");

        setTitle("");
        setAmount("");
        setCurrencyId("");
        setNote("");
        setType("");
        setContext("");
        setCurrencyId("");
        setPaymentMethodId("");
        setReceipt(null);
      } catch (error: any) {
        toast.error(error?.data?.message ?? "Uncaught error.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 gap-4">
      {/* Title */}
      <TransactionTitle
        title={title}
        setTitle={setTitle}
        validationError={formErrors?.title}
      />
      {/* Amount */}
      <TransactionAmount
        amount={amount}
        setAmount={setAmount}
        validationError={formErrors?.amount}
      />
      {/* Type */}
      <TransactionType
        type={type}
        setType={setType}
        validationError={formErrors?.type}
      />
      {/* Method */}
      {paymentMethod && (
        <TransactionMethod
          userId={user?.id ?? ""}
          paymentMethodId={paymentMethodId ?? ""}
          setPaymentMethodId={setPaymentMethodId}
          validationError={formErrors?.method}
        />
      )}
      {/* Currency */}
      {paymentMethod?.budgets && (
        <TransactionCurrency
          currencies={paymentMethod?.budgets ?? []}
          currencyId={currencyId}
          setCurrencyId={setCurrencyId}
          validationError={formErrors?.currencyId}
        />
      )}
      {/* Business or Personal Toggle */}
      <TransactionContext
        context={context}
        setContext={setContext}
        validationError={formErrors?.context}
      />
      <>
        <UploadField
          receipt={receipt}
          setReceipt={setReceipt}
          username={user?.username as string}
        />
      </>
      {/* Note */}
      <TransactionNote note={note} setNote={setNote} />

      <SubmitButton
        aria="Create transaction"
        label={creatingTransaction ? "Creating..." : "Create"}
      />
    </form>
  );
};

export default TransactionAdd;
