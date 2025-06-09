import { useState, type FormEvent } from "react";
import { formDiv, input, labelClasses } from "../../app/globalClasses";
import VariantLink from "../../components/VariantLink";
import { loginSchemas } from "./loginSchemas";
import ErrorMessage from "../../components/forms/ErrorMessage";
import type { LoginState } from "./loginTypes";
import { useMutation } from "@tanstack/react-query";
import { login } from "./mutations/login";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../auth/authSlice";

const LoginForm = () => {
  const [formData, setFormData] = useState<LoginState>({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });
  const [serverError, setServerError] = useState("");
  const dispatch = useDispatch();

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      setFormData({
        email: "",
        password: "",
      });
      dispatch(loginSuccess(user));
    },
    onError: (error: any) => {
      setServerError(error.message);
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event?.currentTarget);

    const verifyData = loginSchemas.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!verifyData.success) {
      const errors = verifyData.error.flatten().fieldErrors;

      setFormErrors({
        email: errors.email?.join(", ") || "",
        password: errors.password?.join(", ") || "",
      });
    }

    if (verifyData.success) {
      mutation.mutate({
        ...verifyData.data,
      });
      setFormErrors({
        email: "",
        password: "",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-6 bg-[#1b1918] rounded-[8px] p-5 text-[#f9f4da]"
    >
      <h1>Login Form</h1>
      {/* Email */}
      <div className={formDiv}>
        <label className={labelClasses}>
          Email <ErrorMessage field={formErrors.email} />{" "}
        </label>
        <input
          className={input}
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Your email"
        />
      </div>
      {/* Password */}
      <div className={formDiv}>
        <label className={labelClasses}>
          Password <ErrorMessage field={formErrors.password} />
        </label>
        <input
          className={input}
          type="password"
          name="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder="Your password"
        />
      </div>
      {/* Submit VariantLink */}
      <VariantLink
        variant="PRIMARY"
        aria="Click to login"
        type="submit"
        label="Login"
      />
      {serverError && (
        <p className="error" style={{ color: "red", marginBottom: "1rem" }}>
          {serverError}
        </p>
      )}{" "}
    </form>
  );
};

export default LoginForm;
