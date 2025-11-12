import { Link } from "react-router";
import {
  useGetCurrenciesQuery,
  useRemoveCurrencyByIdMutation,
} from "./api/currenciesApi";
import type { CurrencyState } from "./types/currencyTypes";
import { PRIMARY, SHARED } from "../../../app/globalClasses";
import BlurredSpinner from "../../../components/BlurredSpinner";
import { toast } from "react-toastify";
import NoDataFallback from "../../../components/forms/NoDataFallback";
import Button from "../../../components/Button";
import DeleteRecordModal from "../../../components/DeleteRecordModal";
import { useState } from "react";

const CurrencyList = () => {
  const { data, isLoading: fetchinCurrencies } = useGetCurrenciesQuery();
  const [removeCurrencyById, { isLoading: loadingCurrencies }] =
    useRemoveCurrencyByIdMutation();

  const handleDelete = async (id: string) => {
    const toastId = toast.info(
      `${showDeleteModal?.itemTitle} is being deleted...`
    );
    try {
      await removeCurrencyById(id);
      setShowDeleteModal({
        show: false,
        itemId: null,
        itemTitle: null,
      });
      toast.update(toastId, {
        render: `${showDeleteModal?.itemTitle} has been deleted`,
        type: "success",
        autoClose: 5000,
        isLoading: false,
      });
    } catch (error: any) {
      toast.update(toastId, {
        render: error?.data?.message ?? "Uncaught error.",
        type: "error",
        autoClose: 5000,
        isLoading: false,
      });
    }
  };

  const [showDeleteModal, setShowDeleteModal] = useState<{
    show: boolean;
    itemId: string | null;
    itemTitle: string | null;
  }>({
    show: false,
    itemId: null,
    itemTitle: "",
  });

  if (loadingCurrencies || fetchinCurrencies) return <BlurredSpinner />;

  return (
    <>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
        {data?.map((currency: CurrencyState) => {
          const { code, symbol, name } = currency;
          return (
            <div
              key={code}
              className="bg-[#2A2B3D] text-white p-4 flex flex-col justify-between gap-4"
            >
              <div className="flex items-center gap-2 w-fit">
                <p>({symbol})</p>
                <p>{code}</p>
              </div>
              <p className="font-bold text-2xl">{name}</p>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  className={`${PRIMARY} ${SHARED}`}
                  to={`/currencies/${code}`}
                >
                  Edit
                </Link>
                <Button
                  ariaLabel="Delete currency"
                  variant="DANGER"
                  onClick={() =>
                    setShowDeleteModal({
                      show: true,
                      itemId: code,
                      itemTitle: name,
                    })
                  }
                >
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      {!data?.length && (
        <NoDataFallback dataType="Currencies" goTo="/currencies/add" />
      )}

      <DeleteRecordModal
        showModal={showDeleteModal?.show}
        itemId={showDeleteModal?.itemId}
        itemTitle={showDeleteModal?.itemTitle}
        onCancel={() =>
          setShowDeleteModal({
            show: false,
            itemId: null,
            itemTitle: null,
          })
        }
        deleteFn={() => handleDelete(showDeleteModal?.itemId)}
      />
    </>
  );
};

export default CurrencyList;
