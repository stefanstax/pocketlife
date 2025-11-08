import { useEffect, useState, type FormEvent } from "react";
import { transactionSchema } from "./schemas/transactionSchemas";
import {
  type TransactionContexts,
  type TransactionTypes,
  type Receipt,
  type TransactionVATOption,
} from "./types/transactionTypes";
import SubmitButton from "../../components/SubmitButton";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import TransactionTitle from "./fields/TransactionTitle";
import TransactionAmount from "./fields/TransactionAmount";
import TransactionType from "./fields/TransactionType";
import TransactionCurrency from "./fields/TransactionCurrency";
import TransactionContext from "./fields/TransactionContext";
import TransactionNote from "./fields/TransactionNote";
import { useUpdateTransactionMutation } from "./api/transactionsApi";
import UploadField from "../../components/forms/UploadFile";
import { toast } from "react-toastify";
import TransactionMethod from "./fields/TransactionMethod";
import { useDispatch } from "react-redux";

import TransactionCategory from "./fields/TransactionCategory";
import { useGetCategoriesQuery } from "./category/api/transactionCategories";
import TransaactionDateTime from "./fields/TransaactionDateTime";
import TransactionFee from "./fields/TransactionFee";
import { PRIMARY, SHARED } from "../../app/globalClasses";
import { closeOverview } from "../../app/overviewSlice";
import { FaWindowClose } from "react-icons/fa";
import TransactionInvoiceNumber from "./fields/TransactionInvoiceNumber";
import DataSpinner from "../../components/DataSpinner";
import TransactionVAT from "./fields/TransactionVAT";

const EditTransaction = ({ data }) => {
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<number | "">("");
  const [fee, setFee] = useState<number>(0);
  const [vat, setVat] = useState<TransactionVATOption>("0%");
  const [currencyId, setCurrencyId] = useState<string | "">("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [created_at, setCreatedAt] = useState<string | "">("");
  const [note, setNote] = useState<string>("");
  const [type, setType] = useState<TransactionTypes | "">("");
  const [context, setContext] = useState<TransactionContexts | "">("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<string | "">("");
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>(
    {}
  );

  const dispatch = useDispatch();

  // Grab redux user data to locate paymentMethods
  const { user } = useSelector((state: RootState) => state.auth);
  const transactionData = data;
  const findBudget = transactionData?.paymentMethod?.budgets?.find(
    (budgetId) => budgetId?.currencyId === currencyId
  );
  const { data: transactionCategories, isLoading: categoriesFetcing } =
    useGetCategoriesQuery();

  useEffect(() => {
    if (transactionData !== null) {
      setInvoiceNumber(transactionData?.invoiceNumber);
      setTitle(transactionData?.title);
      setAmount(transactionData?.amount);
      setFee(transactionData?.fee);
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
      setVat(transactionData?.vat);
      setNote(transactionData?.note);
      setContext(transactionData?.context);
      setCreatedAt(transactionData?.created_at);
      setPaymentMethodId(transactionData?.paymentMethodId);
    }
  }, [transactionData]);

  const [updateTransaction] = useUpdateTransactionMutation();

  const currenciesMatch = user?.currencies?.includes(
    transactionData?.currencyId ?? ""
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const verifyData = transactionSchema.safeParse({
      id: transactionData?.id,
      userId: transactionData?.userId,
      invoiceNumber,
      title,
      amount,
      fee,
      vat,
      categoryId,
      currencyId,
      created_at,
      updated_at: new Date().toISOString(),
      note,
      paymentMethodId,
      budgetId: findBudget?.id,
      type,
      context,
      receipt,
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
        await updateTransaction(verifyData?.data).unwrap();

        toast.update(toastId, {
          render: "Transaction has been updated",
          type: "success",
          autoClose: 5000,
          isLoading: false,
        });
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

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full relative flex flex-col gap-4"
    >
      <button
        onClick={() =>
          dispatch(closeOverview({ panelId: transactionData?.id }))
        }
        className={`w-fit ml-auto sticky ${PRIMARY} ${SHARED}`}
      >
        Close <FaWindowClose />
      </button>
      <TransactionType
        type={type}
        setType={setType}
        validationError={formErrors?.type}
      />
      <TransactionInvoiceNumber
        invoiceNumber={invoiceNumber}
        setInvoiceNumber={setInvoiceNumber}
        validationError={formErrors?.invoiceNumber}
      />
      <TransactionTitle
        title={title}
        setTitle={setTitle}
        labelType={type}
        validationError={formErrors?.title}
      />
      <TransactionNote
        note={note}
        setNote={setNote}
        labelType={type}
        validationError={formErrors?.note}
      />
      <TransactionVAT
        vat={vat}
        setVat={setVat}
        validationError={formErrors.vat}
      />
      <TransactionAmount
        amount={amount}
        setAmount={setAmount}
        labelType={type}
        validationError={formErrors?.amount}
      />
      <TransactionFee fee={fee} setFee={setFee} />
      {categoriesFetcing ? (
        <DataSpinner />
      ) : (
        <TransactionCategory
          data={transactionCategories ?? []}
          categoryId={categoryId}
          setCategoryId={setCategoryId}
          validationError={formErrors?.categoryId}
        />
      )}
      <TransaactionDateTime
        created_at={created_at}
        setCreatedAt={setCreatedAt}
      />

      <TransactionMethod
        userId={user?.id ?? ""}
        paymentMethodId={paymentMethodId as string}
        setPaymentMethodId={setPaymentMethodId}
        validationError={formErrors?.method}
      />
      <TransactionCurrency
        currencies={transactionData?.paymentMethod?.budgets ?? []}
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
                className={`px-4 text-white text-sm py-2 ${
                  receipt?.url && "bg-[#1A1A2E]"
                }`}
                href={receipt?.url}
              >
                {receipt?.name}
              </a>
            }
          />

          {formErrors.receipt && (
            <p className="my-2 text-red-400">{formErrors.receipt}</p>
          )}
        </>
      )}

      <SubmitButton aria="Update transaction" label="Update Transaction" />
    </form>
  );
};

export default EditTransaction;
