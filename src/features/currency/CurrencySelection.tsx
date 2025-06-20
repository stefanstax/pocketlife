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
import { pickCurrency } from "./mutations/pickCurrency";

const CurrencySelection = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data, isLoading, isPending } = useLocalApi("currencies");
  const { data: userData } = useLocalApi("users", user?.id);
  const [pickedCurrencies, setPickedCurrencies] = useState<number[]>([]);

  useEffect(() => {
    if (userData?.currencies) {
      setPickedCurrencies(userData?.currencies);
    }
  }, [userData]);

  // Send data to the server
  const mutation = useMutation({
    mutationFn: pickCurrency,
    onSuccess: () => {
      console.log("Favorite currencies successfully saved!");
    },
  });

  if (isLoading || isPending) return <h1>Currencies are being loaded</h1>;

  const addCurrency = (newCurrency: number) => {
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
    mutation.mutate({
      currencies: pickedCurrencies,
      userId: String(user?.id),
    });
  };

  return (
    <section className="bg-[#1b1918] text-white  p-4 flex flex-col gap-4">
      <h2>Select currencies you would like to use</h2>
      <div className="flex gap-2">
        {data.map((currency: CurrencyState) => {
          return (
            <Button
              key={currency.id}
              ariaLabel="Add currency to favorites"
              variant={
                pickedCurrencies.includes(currency.id as number)
                  ? "PRIMARY"
                  : "TERTIARY"
              }
              onClick={() => addCurrency(currency.id as number)}
            >
              {currency.code}{" "}
              {pickedCurrencies.includes(currency.id as number) ? (
                <MdOutlineCheckBox />
              ) : (
                <MdOutlineCheckBoxOutlineBlank />
              )}
            </Button>
          );
        })}
        <Button
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
