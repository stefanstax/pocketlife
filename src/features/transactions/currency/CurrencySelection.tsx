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
import BlurredSpinner from "../../../components/BlurredSpinner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useGetPaymentMethodsQuery } from "../paymentMethods/api/paymentMethodsApi";

const CurrencySelection = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data, isLoading: loadingCurrencies } = useGetCurrenciesQuery();
  const [pickedCurrencies, setPickedCurrencies] = useState<string[]>([]);
  const navigate = useNavigate();

  const [saveFavoriteCurrencies] = useSaveFavoriteCurrenciesMutation();
  const { data: hasPaymentMethods } = useGetPaymentMethodsQuery();
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
      const updatedUser = saveFavoriteCurrencies({
        userId: user?.id ?? "",
        currencies: pickedCurrencies,
      }).unwrap();

      await toast.promise(updatedUser, {
        pending: "Favorite currencies are being added.",
        success: "Favorite currencies have been saved.",
      });

      dispatch(updateUser(await updatedUser));
      if (hasPaymentMethods) {
        navigate("/transactions");
      } else {
        navigate("/payment-methods");
      }
    } catch (error: any) {
      return toast.error(error?.data?.message ?? "Uncaught error.");
    }
  };

  if (loadingCurrencies) return <BlurredSpinner />;

  return (
    <section className="w-full mx-auto grid grid-cols-1 gap-4 rounded-lg">
      <h2 className="text-2xl font-bold text-center">
        Select currencies you would like to use
      </h2>
      <div className="grid grid-cols-4 justify-center gap-2">
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
      </div>
      <Button
        type="button"
        variant="PRIMARY"
        ariaLabel="Save currencies to favorites"
        onClick={saveToFavorites}
      >
        Save to Favorites
      </Button>
    </section>
  );
};

export default CurrencySelection;
