import { useLocalApi } from "../../app/hooks";
import VariantLink from "../../components/VariantLink";
import type { CurrencyState } from "./currencyTypes";

const CurrencyList = () => {
  const { data, isLoading, isPending } = useLocalApi("currencies");

  if (isLoading || isPending) return <h1>Loading...</h1>;
  return (
    <div className="flex gap-4">
      {data?.map((currency: CurrencyState) => {
        return (
          <VariantLink
            variant="PRIMARY"
            aria={`Go to ${currency.code} page`}
            link={`${currency.id}`}
            label={currency.code}
          />
        );
      })}
    </div>
  );
};

export default CurrencyList;
