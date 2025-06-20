import { useSelector } from "react-redux";
import { useLocalApi } from "../../app/hooks";
import type { RootState } from "../../app/store";
import VariantLink from "../../components/VariantLink";
import PersonalTransactions from "./PersonalTransactions";
import BusinessTransactions from "./BusinessTransactions";
import type { Transaction } from "./transactionTypes";

const TransactionList = () => {
  const { data, isLoading, isPending } = useLocalApi("transactions");

  const { user } = useSelector((state: RootState) => state.auth);
  if (isLoading || isPending) {
    return <h1>Loading...</h1>;
  }

  const personalTransacations = data?.filter(
    (transaction: Transaction) => transaction.context === "PERSONAL"
  );

  const businessTransacations = data?.filter(
    (transaction: Transaction) => transaction.context === "BUSINESS"
  );

  console.log(personalTransacations, businessTransacations);

  return (
    <section>
      <div className="flex gap-4 flex-wrap items-stretch justify-between">
        {data?.length === undefined && (
          <>
            <p>Hey {user?.username}, add your first transaction! </p>
            <VariantLink
              variant="PRIMARY"
              aria="Go to transaction addition page"
              label="Add new transaction"
              link="http://localhost:5173/transactions/add"
            />
          </>
        )}

        <h3 className="text-2xl font-[700]">Personal Transactions</h3>
        <PersonalTransactions data={personalTransacations} />
        <h3 className="text-2xl font-[700]">Business Transactions</h3>
        <BusinessTransactions data={businessTransacations} />

        {data?.length && (
          <VariantLink
            link="http://localhost:5173/transactions/add"
            variant="PRIMARY"
            aria="Go to transactions add page"
            label="Add new Transaction"
          />
        )}
      </div>
    </section>
  );
};

export default TransactionList;
