import { PRIMARY, SHARED } from "../app/globalClasses";

const SubmitButton = ({ aria, label }: { aria: string; label: string }) => {
  return (
    <button
      className={`${PRIMARY} ${SHARED} flex-1 min-w-[100px]`}
      type="submit"
      aria-label={aria}
    >
      {label}
    </button>
  );
};

export default SubmitButton;
