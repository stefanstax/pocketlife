import { useSelector } from "react-redux";
import { useLocalApi } from "../../app/hooks";
import type { RootState } from "../../app/store";
import type { CurrencyState } from "./currencyTypes";
import { useEffect, useState } from "react";

// Icons
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { MdOutlineCheckBox } from "react-icons/md";
import Button from "../../components/Button";
import { useMutation } from "@tanstack/react-query";

const CurrencySelection = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data, isLoading, isPending } = useLocalApi("currencies");
  const [pickedCurrencies, setPickedCurrencies] = useState<string[]>([]);

  console.log(user);

  useEffect(() => {
    if (user?.currencies) {
      setPickedCurrencies(user?.currencies);
    }
  }, [user]);

  // Send data to the server
  // const mutation = useMutation({
  //   mutationFn: pickCurrency,
  //   onSuccess: () => {
  //     console.log("Favorite currencies successfully saved!");
  //   },
  // });

  if (isLoading || isPending) return <h1>Currencies are being loaded</h1>;

  const addCurrency = (newCurrency: string) => {
    const alreadyExists = pickedCurrencies.find(
      (existing) => existing === newCurrency
    );

    const uniqueEntries = pickedCurrencies.filter((i) => i !== newCurrency);

    if (!alreadyExists) {
      setPickedCurrencies([...pickedCurrencies, newCurrency]);
    } else {
      setPickedCurrencies(uniqueEntries);
    }
  };

  const saveToFavorites = () => {
    // mutation.mutate({
    //   currencies: pickedCurrencies,
    //   userId: user?.id as string,
    // });
  };

  console.log(pickedCurrencies);

  return (
    <section className="bg-[#1b1918] text-white  p-4 flex flex-col gap-4">
      <h2>Select currencies you would like to use</h2>
      <div className="flex gap-2">
        {data.map((currency: CurrencyState) => {
          return (
            <Button
              type="button"
              key={currency.id}
              ariaLabel="Add currency to favorites"
              variant={
                pickedCurrencies.includes(currency.id as string)
                  ? "PRIMARY"
                  : "TERTIARY"
              }
              onClick={() => addCurrency(currency.id as string)}
            >
              {currency.code}{" "}
              {pickedCurrencies.includes(currency.id as string) ? (
                <MdOutlineCheckBox />
              ) : (
                <MdOutlineCheckBoxOutlineBlank />
              )}
            </Button>
          );
        })}
        <Button
          type="submit"
          variant="PRIMARY"
          ariaLabel="Save currencies to favorites"
          onClick={saveToFavorites}
        >
          Save to Favorites
        </Button>
      </div>
    </section>
  );
};

export default CurrencySelection;
