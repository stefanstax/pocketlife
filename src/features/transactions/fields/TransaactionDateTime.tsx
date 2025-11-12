import {
  formDiv,
  input,
  inputPicked,
  labelClasses,
} from "../../../app/globalClasses";

const TransaactionDateTime = ({
  created_at,
  setCreatedAt,
}: {
  created_at: string;
  setCreatedAt: (value: string) => void;
}) => {
  return (
    <div className={formDiv}>
      <label htmlFor="dateTime" className={labelClasses}>
        Payment received date
      </label>
      <span className="text-xs pb-2">
        Skip if you want to use to use current date and time. Usually not
        recommended for business transactions.
      </span>

      <div className={`${input} flex gap-4 text-sm flex-wrap`}>
        <input
          className={`p-2 ${created_at ? inputPicked : ""} `}
          style={{
            appearance: "none",
            WebkitAppearance: "none" as "none",
            MozAppearance: "none",
          }}
          type="datetime-local"
          name="created_at"
          onChange={(e) => setCreatedAt(e.target.value)}
          value={created_at?.slice(0, 16)}
        />
      </div>
    </div>
  );
};

export default TransaactionDateTime;
