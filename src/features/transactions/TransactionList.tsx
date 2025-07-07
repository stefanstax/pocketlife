import BlurredSpinner from "../../components/BlurredSpinner";
import { useGetTransactionsQuery } from "./api/transactionsApi";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import Pagination from "../../components/Pagination";
import { useEffect, useState } from "react";
import NoDataFallback from "../../components/forms/NoDataFallback";
import type { EnrichedTransaction } from "./transactionTypes";
import TransactionGrid from "./TransactionsGrid";

const TransactionList = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, refetch, isSuccess, isLoading } = useGetTransactionsQuery({
    userId: user?.id ?? "",
    page,
    limit,
    sortBy: "created_at",
    order: "desc",
  });

  useEffect(() => {
    if (isSuccess) refetch();
  }, [isSuccess]);

  if (isLoading) {
    return <BlurredSpinner />;
  }

  return (
    <div className="w-full">
      {data!.total >= 1 ? (
        <div className="flex flex-col justify-start items-start gap-2">
          <TransactionGrid data={data?.data as EnrichedTransaction[]} />
          {data!.total >= 5 ? (
            <Pagination
              page={page}
              total={data?.total as number}
              perPage={limit}
              onPageChange={setPage}
            />
          ) : null}
        </div>
      ) : (
        <NoDataFallback dataType="transactions" />
      )}
    </div>
  );
};

export default TransactionList;
