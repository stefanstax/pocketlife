import { formDiv, input, labelClasses } from "../../../app/globalClasses";

const TransactionFee = ({
  fee,
  setFee,
}: {
  fee: number;
  setFee: (value: number) => void;
}) => {
  return (
    <div className={formDiv}>
      <label htmlFor="fees" className={labelClasses}>
        Fee
      </label>
      <span className="text-xs pb-2">Default is 0, Use comma.</span>
      <input
        type="number"
        className={input}
        name="fee"
        value={fee}
        onChange={(e) => setFee(+e.target.value)}
      />
    </div>
  );
};

export default TransactionFee;
