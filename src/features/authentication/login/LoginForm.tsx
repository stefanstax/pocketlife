import { useState, type FormEvent } from "react";
import { formDiv, input, labelClasses } from "../../../app/globalClasses";
import { useDispatch } from "react-redux";
import { loginSuccess, updateUser } from "../../../app/authSlice";
import Button from "../../../components/Button";
import { loginSchemas } from "./loginSchemas";
import { useLoginUserMutation } from "../api/authApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import FormError from "../../../components/FormError";
import { useLazyGetPaymentMethodsQuery } from "../../transactions/paymentMethods/api/paymentMethodsApi";

const LoginForm = () => {
  const [email, setEmail] = useState<string | "">("");
  const [passcode, setPasscode] = useState<string | "">("");
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>(
    {}
  );

  const [getPaymentMethods] = useLazyGetPaymentMethodsQuery();

  const [loginUser] = useLoginUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const verifyData = loginSchemas.safeParse({
      email,
      passcode,
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
      const toastId = toast.info("We're checking your creds...");
      try {
        const { token, user } = await loginUser(verifyData.data).unwrap();

        toast.update(toastId, {
          render: `${user?.name}, welcome!`,
          type: "success",
          autoClose: 5000,
          isLoading: false,
        });

        dispatch(loginSuccess({ token, user }));
        const paymentMethods = await getPaymentMethods().unwrap();
        console.log(paymentMethods);

        const enrichedUser = { ...user, paymentMethods: paymentMethods };
        // Send another update to fill user's data
        dispatch(
          updateUser({
            ...user,
            paymentMethods,
          })
        );

        setFormErrors({});
        if (enrichedUser?.paymentMethods?.length !== 0) {
          navigate("/payment-methods");
        } else {
          navigate("/transactions");
        }
      } catch (error: any) {
        toast.update(toastId, {
          render: error?.data?.message ?? "Uncaught error.",
          type: "error",
          autoClose: 5000,
          isLoading: false,
        });
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
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
