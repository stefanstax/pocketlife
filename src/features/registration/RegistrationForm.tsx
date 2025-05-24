import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import type { Currency, CurrencyState } from "../currency/currencyTypes";
import { register } from "./mutations/register";
import { registrationSchema } from "./registrationSchemas";
import { useLocalApis } from "../../app/hooks";
import { labelClasses } from "../../app/globalClasses";
import type { RegistrationState } from "./registrationTypes";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    defaultCurrency: "",
  });
  const [errors, setErrors] = useState<{
    username: string;
    email: string;
    password: string;
    defaultCurrency: string;
  }>({
    username: "",
    email: "",
    password: "",
    defaultCurrency: "",
  });

  const [currenciesQuery, usersQuery] = useLocalApis("currencies", "users");

  const existingUsers = usersQuery.data;

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      setFormData({
        username: "",
        email: "",
        password: "",
        defaultCurrency: "",
      });
    },
    onError: (error: unknown) => {
      console.error(
        "At the moment we can't register you. This could be due to server issues or certain keywords in your input.",
        error
      );
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const verifyData = registrationSchema.safeParse({
      id: Math.floor(Math.random() * 1000),
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      defaultCurrency: formData.get("defaultCurrency") as CurrencyState,
    });

    if (!verifyData.success) {
      console.error("There was an issue during your registration.");
      const errors = verifyData.error.flatten().fieldErrors;
      setErrors({
        username: errors.username?.join(", ") || "",
        email: errors.email?.join(", ") || "",
        password: errors.password?.join(", ") || "",
        defaultCurrency: errors.defaultCurrency?.join(", ") || "",
      });
      return;
    }

    // Before submitting the user check if email already exists // todo Move to backend afte local migration
    if (
      existingUsers.find(
        (user: RegistrationState) => user.email === formData.get("email")
      )
    ) {
      setErrors({
        ...errors,
        email: "This email already exists.",
      });
    } else {
      mutation.mutate({
        ...verifyData.data,
        defaultCurrency: verifyData.data.defaultCurrency as CurrencyState,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-4 border-1 border-white rounded-[8px] p-5 text-white"
    >
      <h1 className="text-2xl font-black">Registration</h1>
      <p>Your password will be encrypted.</p>
      <label className={labelClasses}>Make a Username</label>

      <input
        style={errors.username ? { borderColor: "red" } : {}}
        className="input"
        type="text"
        name="username"
        value={formData.username}
        onChange={(event) =>
          setFormData({ ...formData, username: event.target.value })
        }
        placeholder="Username..."
      />
      {errors.username && <p className="error">{errors.username}</p>}
      <label className={labelClasses}>Business or Personal Email</label>
      <input
        style={errors.email ? { borderColor: "red" } : {}}
        className="input"
        type="email"
        name="email"
        value={formData.email}
        onChange={(event) =>
          setFormData({ ...formData, email: event.target.value })
        }
        placeholder="Email..."
      />
      {errors.email && <p className="error">{errors.email}</p>}
      <label className={labelClasses}>Password *Will be encrypted</label>
      <input
        style={errors.password ? { borderColor: "red" } : {}}
        className="input"
        type="password"
        name="password"
        value={formData.password}
        onChange={(event) =>
          setFormData({ ...formData, password: event.target.value })
        }
        placeholder="Password..."
      />
      {errors.password && <p className="error">{errors.password}</p>}

      <label className={labelClasses}>Choose a default currency</label>

      {currenciesQuery.isLoading && !currenciesQuery.isError && (
        <p>We're loading currencies</p>
      )}
      {!currenciesQuery.isLoading && !currenciesQuery.isError && (
        <select
          style={errors.defaultCurrency ? { borderColor: "red" } : {}}
          className="input"
          name="defaultCurrency"
          value={formData.defaultCurrency}
          onChange={(event) =>
            setFormData({ ...formData, defaultCurrency: event.target.value })
          }
        >
          <option defaultChecked value="">
            Select default currency
          </option>
          {currenciesQuery.data?.map((currency: Currency) => {
            return (
              <option key={currency.code} value={currency.code}>
                {currency.symbol} / {currency.name}
              </option>
            );
          })}
        </select>
      )}
      <button className="button--submit" type="submit">
        Complete Registration
      </button>
    </form>
  );
};

export default RegistrationForm;
