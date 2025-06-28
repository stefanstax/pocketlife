import { PRIMARY, SHARED } from "../app/globalClasses";

interface PaginationProps {
  page: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  page,
  total,
  perPage,
  onPageChange,
}: PaginationProps) => {
  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const totalPages = Math.ceil(total / perPage);

  console.log(page, total, perPage, totalPages);

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };
  return (
    <div className="grid grid-cols-3 gap-2 items-center">
      <button
        className={`${PRIMARY} ${SHARED}`}
        onClick={handlePrev}
        disabled={page <= 1}
      >
        Previous
      </button>
      <button
        className={`${PRIMARY} ${SHARED}`}
        onClick={handleNext}
        disabled={page >= totalPages}
      >
        Next
      </button>
      <span>
        Page {page} from {totalPages}
      </span>
    </div>
  );
};

export default Pagination;
