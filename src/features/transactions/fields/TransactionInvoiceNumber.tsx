import { formDiv, input, labelClasses } from "../../../app/globalClasses";
import FormError from "../../../components/FormError";

const TransactionInvoiceNumber = ({
  invoiceNumber,
  setInvoiceNumber,
  validationError,
}: {
  invoiceNumber: string;
  setInvoiceNumber: (invoiceNumber: string) => void;
  validationError: string | "";
}) => {
  return (
    <div className={formDiv}>
      <label htmlFor="invoiceNumber" className={labelClasses}>
        Invoice Number
      </label>
      <input
        type="text"
        className={input}
        name="invoiceNumber"
        placeholder="What is the invoice number"
        value={invoiceNumber ?? ""}
        onChange={(e) => setInvoiceNumber(e.target.value)}
      />
      {validationError && <FormError fieldError={validationError} />}
    </div>
  );
};

export default TransactionInvoiceNumber;
