import { useState } from "react";
import { useGetPaymentMethodsQuery } from "../features/transactions/paymentMethods/api/paymentMethodsApi";
import { useGetCategoriesQuery } from "../features/transactions/category/api/transactionCategories";
import { FaFileDownload } from "@react-icons/all-files/fa/FaFileDownload";
import { SHARED, TERTIARY } from "../app/globalClasses";

const CSVHandler = ({ transactions }) => {
  const [isExporting, setIsExporting] = useState(false);

  const { data: paymentMethods } = useGetPaymentMethodsQuery();
  const { data: categories } = useGetCategoriesQuery();

  const escapeCSV = (value) => {
    if (value === null || value === undefined) return "";
    const stringValue = String(value);
    if (
      stringValue.includes(",") ||
      stringValue.includes('"') ||
      stringValue.includes("\n")
    ) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const buildCustomCSV = async () => {
    setIsExporting(true);

    try {
      let csvContent =
        "Date,Title,Amount,Type,Link To Receipt,Payment Method,Currency,Category,Note,Fee\n";

      for (const transaction of transactions) {
        if (transaction.amount > 0) {
          const budget = paymentMethods
            ?.find((pm) =>
              pm?.budgets?.some(
                (budget) => budget?.id === transaction?.budgetId
              )
            )
            ?.budgets?.find((budget) => budget?.id === transaction?.budgetId);

          const row = [
            escapeCSV(new Date(transaction.created_at).toLocaleDateString()),
            escapeCSV(transaction.title),
            escapeCSV(`${transaction?.currency?.code} ${transaction.amount}`),
            escapeCSV(transaction.type),
            escapeCSV(
              transaction.receipt
                ? transaction?.receipt?.url
                : "No receipt provided."
            ),
            escapeCSV(
              paymentMethods?.find(
                (method) => method?.id === transaction?.paymentMethodId
              )?.name || "No payment method provided."
            ),
            escapeCSV(budget?.currencyId || "No budget specified."),
            escapeCSV(
              categories?.find(
                (category) => category?.id == transaction?.categoryId
              )?.name || "No category provided"
            ),
            escapeCSV(transaction.note || "No note provided."),
            escapeCSV(
              `${transaction?.currency?.code} ${transaction.fee}` ||
                `${transaction?.currency?.code} 0.00`
            ),
          ].join(",");

          csvContent += row + "\n";
        }
      }

      return csvContent;
    } catch (error) {
      console.error("Error building CSV:", error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  const downloadCSV = async () => {
    try {
      const csvContent = await buildCustomCSV();

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `transactions-export-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert("Error exporting CSV. Please try again.");
    }
  };

  return (
    <button
      onClick={downloadCSV}
      disabled={isExporting || !transactions?.length}
      className={`${TERTIARY} ${SHARED}`}
    >
      {isExporting ? "Exporting" : "Export"} Transactions <FaFileDownload />
    </button>
  );
};

export default CSVHandler;
