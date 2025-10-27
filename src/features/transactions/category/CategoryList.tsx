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
import { FiEdit2 } from "react-icons/fi";
import { PRIMARY, SHARED } from "../../../app/globalClasses";
import Button from "../../../components/Button";
import { Link } from "react-router";
import DataSpinner from "../../../components/DataSpinner";
import { FaTrash } from "@react-icons/all-files/fa/FaTrash";
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
    <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-4">
      {data?.map((category: CategoryType) => {
        const { name, id, icon } = category;
        return (
          <div
            key={id}
            className="flex flex-col items-start gap-2 border-2 rounded-lg p-4"
          >
            <Suspense fallback={<DataSpinner />}>
              <div className="w-fit px-4 text-[20px] py-1 border-1 rounded-full">
                <IconShowcase pickedIcon={icon} />
              </div>
            </Suspense>
            <p className="text-2xl font-bold">{name}</p>
            <div className="w-full grid grid-cols-2 gap-4 border-t border-gray-800 pt-4">
              <Link
                className={`${PRIMARY} ${SHARED}`}
                to={`/transaction-categories/${id}`}
              >
                <FiEdit2 />
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
                <FaTrash className="min-w-[16px]" />
              </Button>
            </div>
          </div>
        );
      })}
      <DeleteRecordModal
        itemId={showDeleteModal?.itemId}
        itemTitle={showDeleteModal?.itemTitle}
        showModal={showDeleteModal?.show}
        onCancel={() =>
          setShowDeleteModal({ show: false, itemId: null, itemTitle: null })
        }
        deleteFn={() => handleDelete(showDeleteModal?.itemId)}
      />
    </div>
  );
};

export default CategoryList;
