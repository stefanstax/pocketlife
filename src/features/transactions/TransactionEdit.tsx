import { useEffect, useState, type FormEvent } from "react";
import { transactionSchema } from "./transactionSchemas";
import { useNavigate, useParams } from "react-router";
import {
  type TransactionContexts,
  type TransactionTypes,
  type Receipt,
  type Transaction,
} from "./transactionTypes";
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

const EditTransaction = () => {
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<number | "">("");
  const [currencyId, setCurrencyId] = useState<string | "">("");
  const [note, setNote] = useState<string>("");
  const [type, setType] = useState<TransactionTypes | "">("");
  const [context, setContext] = useState<TransactionContexts | "">("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>(
    {}
  );

  // Transaction ID
  const { id } = useParams();

  const navigate = useNavigate();

  // User Data
  const { user } = useSelector((state: RootState) => state.auth);

  // Transaction Data
  const { data: transactionData, isLoading } = useGetTransactionByIdQuery(
    id || ""
  );

  // Update transaction mutation
  const [updateTransaction, { isLoading: updating }] =
    useUpdateTransactionMutation();

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
        setReceipt(transactionData?.receipt);
      }
      setType(transactionData?.type);
      setNote(transactionData?.note);
      setContext(transactionData?.context);
    }
  }, [transactionData]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const result = transactionSchema.safeParse({
      id: id,
      userId: transactionData?.userId,
      title: formData.get("title"),
      amount: formData.get("amount"),
      date: transactionData?.date ?? new Date().toLocaleTimeString(),
      time: transactionData?.time ?? new Date().toLocaleTimeString(),
      currencyId: formData.get("currencyId"),
      note: formData.get("note"),
      type: formData.get("type"),
      context: formData.get("context"),
      receipt: receipt,
    });

    if (!result.success) {
      const flattened = result.error.flatten();

      const fieldErrors = Object.fromEntries(
        Object.entries(flattened.fieldErrors)?.map(([key, val]) => [
          key,
          val?.[0],
        ])
      );

      setFormErrors(fieldErrors);
      return;
    }

    if (result.success) {
      try {
        await updateTransaction(result?.data as Transaction).unwrap();
        navigate("/transactions/");
      } catch (error) {
        console.error("Something went bad", error);
      }
    }
  };

  if (isLoading || updating) return <BlurredSpinner />;

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      {!currenciesMatch && (
        <div className="flex items-center gap-2 bg-black p-4 ">
          <p className="text-red-400">
            *Your transaction currency ({transactionData?.currencyId}) has been
            disabled. Enable it?
          </p>
          <VariantLink
            aria="Go to Currency modification page"
            variant="PRIMARY"
            link="/select-currencies/"
            label="Modify available currencies"
          />
        </div>
      )}
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
      <TransactionType
        type={type}
        setType={setType}
        validationError={formErrors?.type}
      />
      <TransactionCurrency
        currencies={user?.currencies ?? []}
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
                className={`border-1 border-solid border-black px-4 text-white rounded-sm py-2 ${
                  receipt?.url && "bg-[#5152fb]"
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
