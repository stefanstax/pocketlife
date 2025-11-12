import { lazy, Suspense, useState } from "react";
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "./api/transactionCategories";
import type { CategoryType } from "./types/categoryType";
import NoDataFallback from "../../../components/forms/NoDataFallback";
import BlurredSpinner from "../../../components/BlurredSpinner";
const IconShowcase = lazy(() =>
  import("../../../components/IconPicker").then((module) => ({
    default: module.IconShowcase,
  }))
);
import { PRIMARY, SHARED } from "../../../app/globalClasses";
import Button from "../../../components/Button";
import { Link } from "react-router";
import DataSpinner from "../../../components/DataSpinner";
import DeleteRecordModal from "../../../components/DeleteRecordModal";

const CategoryList = () => {
  const { data, isLoading } = useGetCategoriesQuery();

  const [showDeleteModal, setShowDeleteModal] = useState<{
    show: boolean;
    itemId: string | null;
    itemTitle: string | null;
  }>({
    show: false,
    itemId: null,
    itemTitle: "",
  });

  const [deleteCategoryById] = useDeleteCategoryMutation();

  const handleDelete = async (id: string) => {
    await deleteCategoryById(id);
    setShowDeleteModal({
      show: false,
      itemId: null,
      itemTitle: null,
    });
  };

  if (isLoading) return <BlurredSpinner />;

  if (!data)
    return (
      <NoDataFallback
        dataType="transaction categories"
        goTo="/transaction-categories/add"
      />
    );

  return (
    <>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
        {data?.map((category: CategoryType) => {
          const { name, id, icon } = category;
          return (
            <div
              key={id}
              className="bg-[#2A2B3D] text-white flex flex-col items-start gap-2 p-4"
            >
              <div className="flex gap-2 items-center justify-between">
                <Suspense fallback={<DataSpinner />}>
                  <IconShowcase pickedIcon={icon} />
                </Suspense>
                <p className="font-bold">{name}</p>
              </div>
              <div className="w-full grid grid-cols-2 gap-4 pt-4">
                <Link
                  className={`${PRIMARY} ${SHARED}`}
                  to={`/transaction-categories/${id}`}
                >
                  Edit
                </Link>
                <Button
                  ariaLabel="Delete transaction category"
                  variant="DANGER"
                  onClick={() =>
                    setShowDeleteModal({
                      show: true,
                      itemId: id,
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
        <NoDataFallback
          dataType="Transaction categories"
          goTo="/transaction-categories/add"
        />
      )}
      <DeleteRecordModal
        itemId={showDeleteModal?.itemId}
        itemTitle={showDeleteModal?.itemTitle}
        showModal={showDeleteModal?.show}
        onCancel={() =>
          setShowDeleteModal({ show: false, itemId: null, itemTitle: null })
        }
        deleteFn={() => handleDelete(showDeleteModal?.itemId)}
      />
    </>
  );
};

export default CategoryList;
