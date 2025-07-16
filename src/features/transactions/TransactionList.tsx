import BlurredSpinner from "../../components/BlurredSpinner";
import { useGetTransactionsQuery } from "./api/transactionsApi";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import Pagination from "../../components/Pagination";
import { useEffect, useState } from "react";
import NoDataFallback from "../../components/forms/NoDataFallback";
import type { EnrichedTransaction } from "./types/transactionTypes";
import TransactionGrid from "./TransactionsGrid";
import { useGetPaymentMethodsQuery } from "./paymentMethods/api/paymentMethodsApi";
import type { PaymentMethod } from "./paymentMethods/types/paymentMethodsTypes";

const TransactionList = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: paymentMethods } = useGetPaymentMethodsQuery();
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data,
    refetch,
    isSuccess,
    isLoading: transactionsLoading,
  } = useGetTransactionsQuery({
    userId: user?.id ?? "",
    page,
    limit,
    sortBy: "created_at",
    order: "desc",
  });

  useEffect(() => {
    if (isSuccess) refetch();
  }, [isSuccess]);

  if (transactionsLoading) return <BlurredSpinner />;

  return (
    <div className="w-full">
      {data && data?.total >= 1 ? (
        <div className="flex flex-col justify-start items-start gap-2">
          <TransactionGrid
            data={data?.data as EnrichedTransaction[]}
            paymentMethods={paymentMethods as PaymentMethod[]}
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
        <NoDataFallback dataType="transactions" />
      )}
    </div>
  );
};

export default TransactionList;
