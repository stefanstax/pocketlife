import VariantLink from "../../components/VariantLink";
import BlurredSpinner from "../../components/BlurredSpinner";
import { useGetTransactionsQuery } from "./api/transactionsApi";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import type { Transaction, TransactionExtra } from "./transactionTypes";
import PersonalTransactions from "./PersonalTransactions";
import BusinessTransactions from "./BusinessTransactions";

const TransactionList = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const { data, isLoading } = useGetTransactionsQuery(user?.id ?? "");

  if (isLoading) {
    return <BlurredSpinner />;
  }

  const filterByPersonal = data?.filter(
    (transaction: Transaction) => transaction.context === "PERSONAL"
  );

  const filterByBusiness = data?.filter(
    (transaction: Transaction) => transaction.context === "BUSINESS"
  );

  return (
    <section>
      <div className="flex gap-4 mb-10 flex-wrap items-stretch justify-between">
        <h3 className="text-2xl font-[700]">Personal Transactions</h3>
        <PersonalTransactions data={filterByPersonal as TransactionExtra[]} />
        <h3 className="text-2xl font-[700]">Business Transactions</h3>
        <BusinessTransactions data={filterByBusiness as TransactionExtra[]} />
      </div>
      <VariantLink
        variant="PRIMARY"
        aria="Go to transaction addition page"
        label="Add new transaction"
        link="http://localhost:5173/transactions/add"
      />
    </section>
  );
};

export default TransactionList;
