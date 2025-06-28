import { PRIMARY, SHARED } from "../app/globalClasses";

const SubmitButton = ({ aria, label }: { aria: string; label: string }) => {
  return (
    <button className={`${PRIMARY} ${SHARED}`} type="submit" aria-label={aria}>
      {label}
    </button>
  );
};

export default SubmitButton;
