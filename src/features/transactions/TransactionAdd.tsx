import { useState, type FormEvent } from "react";
import { newTransactionSchema } from "./schemas/transactionSchemas";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import {
  type Receipt,
  type TransactionContexts,
  type TransactionTypes,
  type TransactionVATOption,
} from "./types/transactionTypes";
import SubmitButton from "../../components/SubmitButton";
// Form Fields
import TransactionTitle from "./fields/TransactionTitle";
import TransactionAmount from "./fields/TransactionAmount";
import TransactionType from "./fields/TransactionType";
import TransactionContext from "./fields/TransactionContext";
import TransactionNote from "./fields/TransactionNote";
import TransactionMethod from "./fields/TransactionMethod";
import TransactionCurrency from "./fields/TransactionCurrency";
import TransaactionDateTime from "./fields/TransaactionDateTime";
import TransactionCategory from "./fields/TransactionCategory";

// Spinners
import DataSpinner from "../../components/DataSpinner";

import { useAddTransactionMutation } from "./api/transactionsApi";
import UploadField from "../../components/forms/UploadFile";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import { useGetPaymentMethodByIdQuery } from "./paymentMethods/api/paymentMethodsApi";
import { useGetCategoriesQuery } from "./category/api/transactionCategories";
import { updateUserBudget } from "../../app/authSlice";
import TransactionFee from "./fields/TransactionFee";
import TransactionInvoiceNumber from "./fields/TransactionInvoiceNumber";
import TransactionVAT from "./fields/TransactionVAT";

const TransactionAdd = () => {
  const [type, setType] = useState<TransactionTypes | "">("");
  const [vat, setVat] = useState<TransactionVATOption>("0%");
  const [invoiceNumber, setInvoiceNumber] = useState<string | "">("");
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<number | "">("");
  const [fee, setFee] = useState<number>(0);
  const [created_at, setCreatedAt] = useState<string | "">("");
  const [context, setContext] = useState<TransactionContexts | "">("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [currencyId, setCurrencyId] = useState<string | "">("");
  const [note, setNote] = useState<string>("");
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

  const isExpense = type === "EXPENSE";

  const {
    data: transactionCategories,
    isLoading: transactionCategoriesLoading,
  } = useGetCategoriesQuery(undefined, {
    skip: !isExpense,
  });

  const findBudget = paymentMethod?.budgets?.find(
    (budgetId) => budgetId?.currencyId === currencyId
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const verifiedData = newTransactionSchema.safeParse({
      type,
      vat,
      invoiceNumber,
      title,
      amount,
      fee,
      categoryId,
      currencyId,
      created_at: created_at || new Date().toISOString(), // If empty use current date and time
      note,
      paymentMethodId,
      budgetId: findBudget?.id,
      context,
      receipt,
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
        setType("");
        setVat("0%");
        setInvoiceNumber("");
        setTitle("");
        setAmount("");
        setFee(0);
        setCurrencyId("");
        setCreatedAt("");
        setNote("");
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
      {/* Type */}
      <TransactionType
        type={type}
        setType={setType}
        validationError={formErrors?.type}
      />
      {/* VAT */}
      <TransactionVAT
        vat={vat}
        setVat={setVat}
        validationError={formErrors?.vat}
      />
      {/* Invoice Number */}
      <TransactionInvoiceNumber
        invoiceNumber={invoiceNumber}
        setInvoiceNumber={setInvoiceNumber}
        validationError={formErrors?.invoiceNumber}
      />
      {/* Title */}
      <TransactionTitle
        title={title}
        setTitle={setTitle}
        labelType={type}
        validationError={formErrors?.title}
      />
      {/* Note */}
      <TransactionNote note={note} setNote={setNote} labelType={type} />
      {/* Amount */}
      <TransactionAmount
        amount={amount}
        setAmount={setAmount}
        labelType={type}
        validationError={formErrors?.amount}
      />
      {/* Fees */}
      <TransactionFee fee={fee} setFee={setFee} />
      {/* Category */}
      {transactionCategoriesLoading ? (
        <DataSpinner />
      ) : (
        <TransactionCategory
          data={transactionCategories ?? []}
          categoryId={categoryId}
          setCategoryId={setCategoryId}
          validationError={formErrors?.category}
        />
      )}
      <TransaactionDateTime
        created_at={created_at}
        setCreatedAt={setCreatedAt}
      />

      {/* Method */}
      {paymentMethodLoading ? (
        <DataSpinner />
      ) : (
        <TransactionMethod
          userId={user?.id ?? ""}
          paymentMethodId={paymentMethodId ?? ""}
          setPaymentMethodId={setPaymentMethodId}
          validationError={formErrors?.paymentMethodId}
        />
      )}
      {/* Currency */}
      {paymentMethod?.budgets?.length > 0 && (
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
      <UploadField
        receipt={receipt}
        setReceipt={setReceipt}
        username={user?.username as string}
      />

      <SubmitButton
        aria="Create transaction"
        label={creatingTransaction ? "Creating..." : "Create"}
      />
    </form>
  );
};

export default TransactionAdd;
