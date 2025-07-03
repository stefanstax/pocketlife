import { useState, type FormEvent } from "react";
import { registrationSchema } from "./registrationSchemas";
import { formDiv, input, labelClasses } from "../../../app/globalClasses";
import { type RegistrationState } from "./registrationTypes";
import ErrorMessage from "../../../components/forms/ErrorMessage";
import Button from "../../../components/Button";
import { useAddUserMutation } from "../api/authApi";
import { toast } from "react-toastify";

const RegistrationForm = () => {
  const [formData, setFormData] = useState<RegistrationState>({
    username: "",
    email: "",
    password: "",
    currencies: [],
  });
  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [addUser] = useAddUserMutation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const verifyData = registrationSchema.safeParse({
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      currencies: [],
    });

    if (!verifyData.success) {
      const errors = verifyData.error.flatten().fieldErrors;

      setFormErrors({
        username: errors?.username?.join(", ") || "",
        email: errors?.email?.join(", ") || "",
        password: errors?.password?.join(", ") || "",
      });
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
      } catch (error: any) {
        toast.error(error?.data?.message ?? "Uncaught error. Check console.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-6 bg-[#1b1918]  p-5 text-white"
    >
      <h1 className="text-2xl font-black">Registration</h1>
      <p>Your password will be hashed.</p>
      {/* Username */}
      <div className={formDiv}>
        <label className={labelClasses}>
          Make a Username <ErrorMessage field={formErrors.username} />
        </label>
        <input
          className={input}
          type="text"
          name="username"
          value={formData.username}
          onChange={(event) =>
            setFormData({ ...formData, username: event.target.value })
          }
          placeholder="Username..."
        />
      </div>
      {/* Email */}
      <div className={formDiv}>
        <label className={labelClasses}>
          Business or Personal Email <ErrorMessage field={formErrors.email} />
        </label>
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
          onChange={(event) =>
            setFormData({ ...formData, password: event.target.value })
          }
          placeholder="Password..."
        />
      </div>
      <Button type="submit" variant="PRIMARY" ariaLabel="Login current user">
        Login
      </Button>
    </form>
  );
};

export default RegistrationForm;
