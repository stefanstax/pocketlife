import { lazy, Suspense, useState, type FormEvent } from "react";
import { newTransactionSchema } from "./schemas/transactionSchemas";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import {
  type Receipt,
  type TransactionContexts,
  type TransactionTypes,
} from "./types/transactionTypes";
import SubmitButton from "../../components/SubmitButton";
// Form Fields
import TransactionTitle from "./fields/TransactionTitle";
import TransactionAmount from "./fields/TransactionAmount";
import TransactionType from "./fields/TransactionType";
import TransactionContext from "./fields/TransactionContext";
import TransactionNote from "./fields/TransactionNote";
import TransactionMethod from "./fields/TransactionMethod";
import DataSpinner from "../../components/DataSpinner";

const TransactionCurrency = lazy(() => import("./fields/TransactionCurrency"));
const TransactionCategory = lazy(() => import("./fields/TransactionCategory"));
import { useAddTransactionMutation } from "./api/transactionsApi";
import UploadField from "../../components/forms/UploadFile";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import { useGetPaymentMethodByIdQuery } from "./paymentMethods/api/paymentMethodsApi";
import { useGetCategoriesQuery } from "./category/api/transactionCategories";
import { updateUserBudget } from "../../app/authSlice";

const TransactionAdd = () => {
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<number | "">("");
  const [context, setContext] = useState<TransactionContexts | "">("");
  const [categoryId, setCategoryId] = useState<string>("");
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

  const { data: paymentMethod, isLoading: paymentMethodLoading } =
    useGetPaymentMethodByIdQuery(paymentMethodId ?? "");

  const { data: transactionCategores, isLoading: transactionCategoresLoading } =
    useGetCategoriesQuery();

  const findBudget = paymentMethod?.budgets?.find(
    (budgetId) => budgetId?.currencyId === currencyId
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const verifiedData = newTransactionSchema.safeParse({
      title,
      amount,
      categoryId,
      currencyId,
      created_at: new Date().toISOString(),
      note,
      type,
      paymentMethodId,
      budgetId: findBudget?.id,
      context,
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
      const toastId = toast.info("Transaction is being created...");
      try {
        dispatch(
          updateUserBudget({
            budgetId: findBudget?.id,
            currencyId: findBudget?.currencyId,
            amount: +amount,
            type: type === "INCOME" ? "ADD" : "SUBTRACT",
          })
        );

        await addTransaction(verifiedData.data).unwrap();

        toast.update(toastId, {
          render: "Transaction has been created.",
          type: "success",
          autoClose: 5000,
          isLoading: false,
        });

        //* Clear state as user is being kept on the same page
        setTitle("");
        setAmount("");
        setCurrencyId("");
        setNote("");
        setType("");
        setContext("");
        setCategoryId("");
        setPaymentMethodId("");
        setReceipt(null);
      } catch (error: any) {
        toast.update(toastId, {
          render: error?.data?.message,
          type: "error",
          autoClose: 5000,
          isLoading: false,
        });
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
      {/* Category */}
      {transactionCategoresLoading ? (
        <DataSpinner />
      ) : (
        <Suspense fallback={<DataSpinner />}>
          <TransactionCategory
            data={transactionCategores ?? []}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            validationError={formErrors?.category}
          />
        </Suspense>
      )}
      {/* Type */}
      <TransactionType
        type={type}
        setType={setType}
        validationError={formErrors?.type}
      />
      {/* Method */}
      {paymentMethodLoading ? (
        <DataSpinner />
      ) : (
        <TransactionMethod
          userId={user?.id ?? ""}
          paymentMethodId={paymentMethodId ?? ""}
          setPaymentMethodId={setPaymentMethodId}
          validationError={formErrors?.method}
        />
      )}
      {/* Currency */}
      {paymentMethod?.budgets?.length > 0 && (
        <Suspense fallback={<DataSpinner />}>
          <TransactionCurrency
            currencies={paymentMethod?.budgets ?? []}
            currencyId={currencyId}
            setCurrencyId={setCurrencyId}
            validationError={formErrors?.currencyId}
          />
        </Suspense>
      )}
      {/* Business or Personal Toggle */}
      <TransactionContext
        context={context}
        setContext={setContext}
        validationError={formErrors?.context}
      />
      <UploadField
        receipt={receipt}
        setReceipt={setReceipt}
        username={user?.username as string}
      />
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
