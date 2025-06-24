import VariantLink from "../VariantLink";

const NoDataFallback = ({ dataType }: { dataType: string }) => {
  return (
    <div className="w-full my-2 flex gap-2 items-center ">
      <p>No {dataType}. Want to add one?</p>
      <VariantLink
        variant="PRIMARY"
        link="/transactions/add"
        label="Add new"
        aria="Add new transaction"
      />
    </div>
  );
};

export default NoDataFallback;
