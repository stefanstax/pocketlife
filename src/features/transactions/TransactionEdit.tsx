import { useEffect, useState, type FormEvent } from "react";
import { transactionSchema } from "./schemas/transactionSchemas";
import { useNavigate, useParams } from "react-router";
import {
  type TransactionContexts,
  type TransactionTypes,
  type Receipt,
} from "./types/transactionTypes";
import SubmitButton from "../../components/SubmitButton";
import VariantLink from "../../components/VariantLink";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import TransactionTitle from "./fields/TransactionTitle";
import TransactionAmount from "./fields/TransactionAmount";
import TransactionType from "./fields/TransactionType";
import TransactionCurrency from "./fields/TransactionCurrency";
import TransactionContext from "./fields/TransactionContext";
import TransactionNote from "./fields/TransactionNote";
import {
  useGetTransactionByIdQuery,
  useUpdateTransactionMutation,
} from "./api/transactionsApi";
import BlurredSpinner from "../../components/BlurredSpinner";
import UploadField from "../../components/forms/UploadFile";
import { toast } from "react-toastify";
import TransactionMethod from "./fields/TransactionMethod";
import { useDispatch } from "react-redux";

import TransactionCategory from "./fields/TransactionCategory";
import { useGetCategoriesQuery } from "./category/api/transactionCategories";
import { updateUserBudget } from "../../app/authSlice";

const EditTransaction = () => {
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<number | "">("");
  const [currencyId, setCurrencyId] = useState<string | "">("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [type, setType] = useState<TransactionTypes | "">("");
  const [context, setContext] = useState<TransactionContexts | "">("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<string | "">("");
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>(
    {}
  );

  const dispatch = useDispatch();

  // Transaction ID
  const { id } = useParams();

  const navigate = useNavigate();

  // Grab redux user data to locate paymentMethods
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: transactionCategories } = useGetCategoriesQuery();

  const findPaymentMethod = user?.paymentMethods?.find(
    (paymentMethod) => paymentMethod?.id === paymentMethodId
  );

  const findBudget = findPaymentMethod?.budgets?.find(
    (budgetId) => budgetId?.currencyId === currencyId
  );

  // Transaction Data
  const { data: transactionData, isLoading } = useGetTransactionByIdQuery(
    id || ""
  );

  const [updateTransaction] = useUpdateTransactionMutation();

  const currenciesMatch = user?.currencies?.includes(
    transactionData?.currencyId ?? ""
  );

  useEffect(() => {
    if (transactionData) {
      setTitle(transactionData?.title);
      setAmount(transactionData?.amount);
      if (currenciesMatch) {
        setCurrencyId(transactionData?.currencyId);
      } else {
        setCurrencyId("");
      }
      if (transactionData?.receipt) {
        setReceipt({
          id: transactionData.receipt.id,
          name: transactionData.receipt.name,
          url: transactionData.receipt.url,
        });
      }
      if (transactionCategories) {
        setCategoryId(transactionData?.categoryId);
      }
      setType(transactionData?.type);
      setNote(transactionData?.note);
      setContext(transactionData?.context);
      setPaymentMethodId(transactionData?.paymentMethodId);
    }
  }, [transactionData]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const verifyData = transactionSchema.safeParse({
      id: id,
      userId: transactionData?.userId,
      title,
      amount,
      categoryId,
      currencyId,
      created_at: transactionData?.created_at,
      updated_at: new Date().toISOString(),
      note,
      paymentMethodId,
      budgetId: findBudget?.id,
      type,
      context,
      receipt: receipt,
    });

    if (!verifyData.success) {
      const flattened = verifyData.error.flatten();
      const fieldErrors = Object.fromEntries(
        Object.entries(flattened.fieldErrors)?.map(([key, val]) => [
          key,
          val?.[0],
        ])
      );

      setFormErrors(fieldErrors);
      return;
    }

    if (verifyData.success) {
      const toastId = toast.info("Transaction is being updated...");

      try {
        if (transactionData?.amount !== +amount) {
          const recalculatedBudgetAmount =
            transactionData.type === "INCOME"
              ? findBudget.amount - transactionData.amount + +amount
              : findBudget.amount + transactionData.amount - +amount;

          dispatch(
            updateUserBudget({
              budgetId: findBudget?.id,
              currencyId: findBudget?.currencyId,
              amount: +recalculatedBudgetAmount,
              type: "SET",
            })
          );
        }

        await updateTransaction(verifyData?.data).unwrap();

        toast.update(toastId, {
          render: "Transaction has been updated",
          type: "success",
          autoClose: 5000,
          isLoading: false,
        });

        navigate("/transactions/");
      } catch (error: any) {
        console.log(error);

        toast.update(toastId, {
          render: error?.data?.message ?? "Uncaught error.",
          type: "error",
          autoClose: 5000,
          isLoading: false,
        });
      }
    }
  };

  if (isLoading) return <BlurredSpinner />;

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      <TransactionTitle
        title={title}
        setTitle={setTitle}
        validationError={formErrors?.title}
      />
      <TransactionAmount
        amount={amount}
        setAmount={setAmount}
        validationError={formErrors?.amount}
      />
      <TransactionCategory
        data={transactionCategories ?? []}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        validationError={formErrors?.categoryId}
      />
      <TransactionType
        type={type}
        setType={setType}
        validationError={formErrors?.type}
      />
      <TransactionMethod
        userId={user?.id ?? ""}
        paymentMethodId={paymentMethodId as string}
        setPaymentMethodId={setPaymentMethodId}
        validationError={formErrors?.method}
      />
      <TransactionCurrency
        currencies={findPaymentMethod?.budgets ?? []}
        currencyId={currencyId as string}
        setCurrencyId={setCurrencyId}
        validationError={formErrors?.currencyId}
      />
      <TransactionContext
        context={context}
        setContext={setContext}
        validationError={formErrors?.context}
      />

      {context !== null && (
        <>
          <UploadField
            receipt={receipt}
            setReceipt={setReceipt}
            username={user?.username as string}
            hasFile={
              <a
                target="_blank"
                className={`border-1 border-solid border-black px-4 text-white rounded-full py-2 ${
                  receipt?.url && "bg-gray-950"
                }`}
                href={receipt?.url}
              >
                View Receipt: {receipt?.name}
              </a>
            }
          />

          {formErrors.receipt && (
            <p className="my-2 text-red-400">{formErrors.receipt}</p>
          )}
        </>
      )}

      <TransactionNote
        note={note}
        setNote={setNote}
        validationError={formErrors?.note}
      />

      <SubmitButton aria="Update transaction" label="Update Transaction" />
    </form>
  );
};

export default EditTransaction;
