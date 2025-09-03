import BlurredSpinner from "../../components/BlurredSpinner";
import Pagination from "../../components/Pagination";
import NoDataFallback from "../../components/forms/NoDataFallback";
import TransactionGrid from "./TransactionsGrid";
import { useGetTransactionsQuery } from "./api/transactionsApi";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useGetCategoriesQuery } from "./category/api/transactionCategories";
import type { RootState } from "../../app/store";
import CSVHandler from "../../components/CSVHandler";

const TransactionList = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const {
    data: transactionCategories,
    isLoading: transactionCategoriesLoading,
  } = useGetCategoriesQuery();
  const [page, setPage] = useState(1);
  const limit = 30;

  const { data, isLoading: transactionsLoading } = useGetTransactionsQuery({
    userId: user?.id ?? "",
    page,
    limit,
    sortBy: "created_at",
    order: "desc",
  });

  if (transactionsLoading || transactionCategoriesLoading)
    return <BlurredSpinner />;

  return (
    <div className="w-full">
      {data && data?.total >= 1 ? (
        <div className="flex flex-col justify-start items-start gap-2">
          <CSVHandler transactions={data?.data} />
          <TransactionGrid
            data={data?.data}
            paymentMethods={user?.paymentMethods}
            categories={transactionCategories}
          />
          {data!.total >= 11 ? (
            <Pagination
              page={page}
              total={data?.total as number}
              perPage={limit}
              onPageChange={setPage}
            />
          ) : null}
        </div>
      ) : (
        <NoDataFallback dataType="transactions" goTo="/transactions/add" />
      )}
    </div>
  );
};

export default TransactionList;
