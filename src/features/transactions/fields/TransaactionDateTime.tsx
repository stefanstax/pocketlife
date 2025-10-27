import { formDiv, input, labelClasses } from "../../../app/globalClasses";

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
        Date & Time
      </label>
      <span className="text-xs pb-2">
        Skip if you want to use to use current date and time.
      </span>

      <div className={`${input} flex gap-4 text-sm flex-wrap`}>
        <input
          className={`p-2 ${created_at ? "bg-[#010d18] text-white" : ""}`}
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
