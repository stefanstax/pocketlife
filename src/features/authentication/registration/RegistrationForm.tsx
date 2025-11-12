import { useState, type FormEvent } from "react";
import { registrationSchema } from "./registrationSchemas";
import { formDiv, input, labelClasses } from "../../../app/globalClasses";
import { type RegistrationState } from "./registrationTypes";
import Button from "../../../components/Button";
import { useAddUserMutation } from "../api/authApi";
import { toast } from "react-toastify";
import FormError from "../../../components/FormError";
import { generateUsername } from "../../../app/generateUsername";
import { useNavigate } from "react-router";

const RegistrationForm = () => {
  const [formData, setFormData] = useState<RegistrationState>({
    username: "",
    email: "",
    name: "",
    securityName: "",
    recoveryUrl: "",
    currencies: [],
    passcode: 0 || "",
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>(
    {}
  );

  const [addUser] = useAddUserMutation();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const verifyData = registrationSchema.safeParse({
      username: generateUsername(),
      email: formData.get("email"),
      name: formData.get("name"),
      recoveryUrl: formData.get("recoveryUrl"),
      securityName: formData.get("securityName"),
      passcode: formData.get("passcode"),
      paymentMethodIds: [],
      currencies: [],
    });

    if (!verifyData.success) {
      console.log(verifyData?.error.flatten());

      const flattenErrors = verifyData.error.flatten();
      const fieldErrors = Object.fromEntries(
        Object.entries(flattenErrors.fieldErrors).map(([key, val]) => [
          key,
          val[0],
        ])
      );
      setFormErrors(fieldErrors);
    }

    if (verifyData?.success) {
      try {
        await toast.promise(
          addUser(verifyData?.data as RegistrationState).unwrap(),
          {
            pending: "We are verifying your credentials.",
            success: "You have been registered.",
          }
        );
        navigate("/authentication/login");
      } catch (error: any) {
        toast.error(error?.data?.message ?? "Uncaught error. Check console.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 gap-6">
      {/* Name */}
      <div className={formDiv}>
        <label className={labelClasses}>Name</label>
        <input
          className={input}
          type="text"
          name="name"
          value={formData.name}
          onChange={(event) =>
            setFormData({ ...formData, name: event.target.value })
          }
          placeholder="Name..."
        />
        <FormError fieldError={formErrors?.name} />
      </div>
      {/* Email */}
      <div className={formDiv}>
        <label className={labelClasses}>Business or Personal Email</label>
        <input
          className={input}
          type="email"
          name="email"
          value={formData.email}
          onChange={(event) =>
            setFormData({ ...formData, email: event.target.value })
          }
          placeholder="Email..."
        />
        <FormError fieldError={formErrors?.email} />
      </div>
      <div className={formDiv}>
        <label className={labelClasses}>Passcode</label>
        <input
          className={input}
          type="number"
          name="passcode"
          value={formData.passcode}
          onChange={(event) =>
            setFormData({ ...formData, passcode: +event.target.value })
          }
          placeholder="6 Digit Passcode"
        />
        <FormError fieldError={formErrors?.passcode} />
      </div>
      {/* Recovery URl */}
      <div className={formDiv}>
        <label className={labelClasses}>Recovery URL</label>
        <input
          className={input}
          type="text"
          name="recoveryUrl"
          value={formData.recoveryUrl}
          onChange={(event) =>
            setFormData({ ...formData, recoveryUrl: event.target.value })
          }
          placeholder="Example mayareco or sara123"
        />
        <FormError fieldError={formErrors?.recoveryUrl} />
      </div>
      {/* Security Name */}
      <div className={formDiv}>
        <label className={labelClasses}>Security Name</label>
        <input
          className={input}
          type="text"
          name="securityName"
          value={formData.securityName}
          onChange={(event) =>
            setFormData({ ...formData, securityName: event.target.value })
          }
          placeholder="Pick ONE word to be your security name"
        />
        <FormError fieldError={formErrors?.securityName} />
      </div>
      <Button type="submit" variant="PRIMARY" ariaLabel="Register current user">
        Sign Up
      </Button>
    </form>
  );
};

export default RegistrationForm;
