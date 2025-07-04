import { useSelector } from "react-redux";
import VariantLink from "../VariantLink";
import type { RootState } from "../../app/store";

const NoDataFallback = ({ dataType }: { dataType: string }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="w-full flex flex-col flex gap-4 mx-auto max-w-[600px]">
      <h1 className="text-2xl font-black">Oh, dang!</h1>
      <p>
        I've looked in database for {dataType}. I couldn't find a single one!
      </p>
      <p>That made me 😞, can you add one?</p>

      {user?.currencies ? (
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
      )}
    </div>
  );
};

export default NoDataFallback;
