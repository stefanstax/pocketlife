import { useState, type FormEvent } from "react";
import { formDiv, input, labelClasses } from "../../../app/globalClasses";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../app/authSlice";
import Button from "../../../components/Button";
import type { LoginState } from "./loginTypes";
import { loginSchemas } from "./loginSchemas";
import { useLoginUserMutation } from "../api/authApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import FormError from "../../../components/FormError";

const LoginForm = () => {
  const [formData, setFormData] = useState<LoginState>({
    email: "",
    passcode: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>(
    {}
  );

  const [loginUser] = useLoginUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event?.currentTarget);

    const verifyData = loginSchemas.safeParse({
      email: formData.get("email"),
      passcode: formData.get("passcode"),
    });

    if (!verifyData.success) {
      const flattenErrors = verifyData.error.flatten();
      const fieldErrors = Object.fromEntries(
        Object.entries(flattenErrors.fieldErrors).map(([key, val]) => [
          key,
          val[0],
        ])
      );

      setFormErrors(fieldErrors);
    }

    if (verifyData.success) {
      try {
        const loginPromise = loginUser(verifyData.data).unwrap();
        const { token, user } = await toast.promise(loginPromise, {
          pending: "Checking your credentials.",
          success: "You have been logged in.",
        });
        dispatch(loginSuccess({ token, user }));

        setFormErrors({});
        if (user?.currencies) {
          navigate("/select-currencies");
          // Not ideal when cache is wiped
        } else if (user?.paymentMethods) {
          navigate("/payment-methods");
        } else {
          navigate("/transactions");
        }
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
        <label className={labelClasses}>Email</label>
        <input
          className={input}
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Your email"
        />
        <FormError fieldError={formErrors?.email} />
      </div>
      <div className={formDiv}>
        <label className={labelClasses}>Passcode</label>
        <input
          className={input}
          type="text"
          name="passcode"
          value={formData.passcode}
          onChange={(e) =>
            setFormData({ ...formData, passcode: e.target.value })
          }
          placeholder="Your passcode"
        />
        <FormError fieldError={formErrors?.passcode} />
      </div>
      <Button type="submit" variant="PRIMARY" ariaLabel="Login current user">
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
