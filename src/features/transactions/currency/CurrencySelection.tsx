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
import ServerMessage from "../../../components/ServerMessage";
import BlurredSpinner from "../../../components/BlurredSpinner";

const CurrencySelection = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data, isLoading: loadingCurrencies } = useGetCurrenciesQuery();
  const [pickedCurrencies, setPickedCurrencies] = useState<string[]>([]);
  const [serverMessage, setServerMessage] = useState<any>();

  const [saveFavoriteCurrencies, { isError }] =
    useSaveFavoriteCurrenciesMutation();
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
      setServerMessage("Favorite currencies succefully saved.");
    } catch (error: any) {
      setServerMessage(error?.data?.message ?? "Uncaught error.");
    }
  };

  if (loadingCurrencies) return <BlurredSpinner />;

  return (
    <section className="w-full p-4 grid grid-cols-1 gap-4 rounded-sm">
      <h2 className="text-2xl font-bold text-center">
        Select currencies you would like to use
      </h2>
      <div className="flex flex-wrap justify-center gap-2">
        {data?.map((currency: CurrencyState) => {
          return (
            <Button
              type="button"
              key={currency.code}
              ariaLabel="Add currency to favorites"
              variant={
                pickedCurrencies.includes(currency.code as string)
                  ? "PRIMARY"
                  : "TERTIARY"
              }
              onClick={() => addCurrency(currency.code as string)}
            >
              {currency.code}{" "}
              {pickedCurrencies.includes(currency.code as string) ? (
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
      {serverMessage && (
        <ServerMessage serverMessage={serverMessage} isError={isError} />
      )}
    </section>
  );
};

export default CurrencySelection;
