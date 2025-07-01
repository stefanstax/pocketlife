import VariantLink from "../../components/VariantLink";
import BlurredSpinner from "../../components/BlurredSpinner";
import { useGetTransactionsQuery } from "./api/transactionsApi";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import Pagination from "../../components/Pagination";
import { useState } from "react";
import TransactionsTable from "./TransactionsTable";
import type { TransactionWithCurrency } from "./transactionTypes";

const TransactionList = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading } = useGetTransactionsQuery({
    userId: user?.id ?? "",
    page,
    limit,
    sortBy: "date",
    order: "desc",
  });

  if (isLoading) {
    return <BlurredSpinner />;
  }

  return (
    <div className="w-full flex flex-col gap-10">
      <div className="flex flex-col justify-start items-start gap-2">
        <TransactionsTable data={data?.data as TransactionWithCurrency[]} />
        <Pagination
          page={page}
          total={data?.total as number}
          perPage={limit}
          onPageChange={setPage}
        />
      </div>
      <VariantLink
        variant="PRIMARY"
        aria="Go to transaction addition page"
        label="Add new transaction"
        link={`${import.meta.env.VITE_WEB_URL}transactions/add`}
      />
    </div>
  );
};

export default TransactionList;
