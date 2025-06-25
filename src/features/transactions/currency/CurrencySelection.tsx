import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import type { CurrencyState } from "./currencyTypes";
import { useEffect, useState } from "react";

// Icons
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { MdOutlineCheckBox } from "react-icons/md";
import Button from "../../../components/Button";
import {
  useGetCurrenciesQuery,
  useSaveFavoriteCurrenciesMutation,
} from "./api/currenciesApi";
import { updateUser } from "../../../app/authSlice";
import { useDispatch } from "react-redux";

const CurrencySelection = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data } = useGetCurrenciesQuery();
  const [pickedCurrencies, setPickedCurrencies] = useState<string[]>([]);

  const [saveFavoriteCurrencies] = useSaveFavoriteCurrenciesMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.currencies) {
      setPickedCurrencies(user?.currencies);
    }
  }, [user]);

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

  const saveToFavorites = async () => {
    try {
      const updatedUser = await saveFavoriteCurrencies({
        userId: user?.id ?? "",
        currencies: pickedCurrencies,
      }).unwrap();
      dispatch(updateUser(updatedUser));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="bg-[#1b1918] text-white  p-4 flex flex-col gap-4">
      <h2>Select currencies you would like to use</h2>
      <div className="flex gap-2">
        {data?.map((currency: CurrencyState) => {
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
          type="button"
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
