import EditTransaction from "./TransactionEdit";

const TransactionPanel = ({ data }) => {
  return (
    <div className="w-full xl:w-6/12 2xl:1/12 fixed inset-0 xl:relative h-full overflow-y-auto bg-[#121223] p-4">
      <EditTransaction data={data} />
    </div>
  );
};

export default TransactionPanel;
