import VariantLink from "../VariantLink";

const NoDataFallback = ({
  dataType,
  goTo,
}: {
  dataType: string;
  goTo: string;
}) => {
  return (
    <div className="w-full bg-[#2A2B3D] p-4 flex flex-col gap-4 text-white mx-auto">
      <h1 className="text-2xl font-black">Oh, dang!</h1>
      <p>
        I've looked in database for {dataType}. I couldn't find a single one!
      </p>
      <p>That made me 😞, can you add one?</p>
      <VariantLink
        variant="PRIMARY"
        link={goTo}
        label="Add new"
        aria="Add new transaction"
      />
      {/* {user?.currencies ? (
        <VariantLink
          variant="PRIMARY"
          link="/transactions/add"
          label="Add new"
          aria="Add new transaction"
        />
      ) : (
        <>
          <p>
            Judging you're fresh off the 🛥️, you first need to add some
            currencies which you will be using.
          </p>
          <VariantLink
            variant="PRIMARY"
            link="/select-currencies"
            label="Add favorite currencies"
            aria="Add favorite currencies"
          />
        </>
      )} */}
    </div>
  );
};

export default NoDataFallback;
