import { buttonSolid } from "../app/globalClasses";

const SubmitButton = ({ aria, label }: { aria: string; label: string }) => {
  return (
    <button
      className={`${buttonSolid} min-h-[52px]`}
      type="submit"
      aria-label={aria}
    >
      {label}
    </button>
  );
};

export default SubmitButton;
