import { useState, type FormEvent } from "react";
import { formDiv, input, labelClasses } from "../../../app/globalClasses";
import ErrorMessage from "../../../components/forms/ErrorMessage";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../app/authSlice";
import Button from "../../../components/Button";
import type { LoginState } from "./loginTypes";
import { loginSchemas } from "./loginSchemas";
import { useLoginUserMutation } from "../api/authApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const LoginForm = () => {
  const [formData, setFormData] = useState<LoginState>({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const [loginUser] = useLoginUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
      try {
        const loginPromise = loginUser(verifyData.data).unwrap();
        const { token, user } = await toast.promise(loginPromise, {
          pending: "Checking your credentials.",
          success: "You have been logged in.",
        });
        dispatch(loginSuccess({ token, user }));

        setFormErrors({
          email: "",
          password: "",
        });
        navigate("/transactions");
      } catch (error: any) {
        toast.error(error?.data?.message ?? "Uncaught error. Check console.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
      <h1 className="text-2xl font-black">Login Form</h1>
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
      <Button type="submit" variant="PRIMARY" ariaLabel="Login current user">
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
