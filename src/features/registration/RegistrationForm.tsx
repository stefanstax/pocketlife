import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { register } from "./mutations/register";
import { registrationSchema } from "./registrationSchemas";
import { formDiv, input, labelClasses } from "../../app/globalClasses";
import { type RegistrationState } from "./registrationTypes";
import ErrorMessage from "../../components/forms/ErrorMessage";
import VariantLink from "../../components/VariantLink";

const RegistrationForm = () => {
  const [formData, setFormData] = useState<RegistrationState>({
    username: "",
    email: "",
    password: "",
  });
  const [serverError, setServerError] = useState<string>("");
  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      setFormData({
        username: "",
        email: "",
        password: "",
      });
    },
    onError: (error: any) => {
      console.error(
        "At the moment we can't register you. This could be due to server issues or certain keywords in your input.",
        error
      );
      setServerError(error.message);
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
    });

    if (!verifyData.success) {
      const errors = verifyData.error.flatten().fieldErrors;

      setFormErrors({
        username: errors.username?.join(", ") || "",
        email: errors.email?.join(", ") || "",
        password: errors.password?.join(", ") || "",
      });
    }

    // Other errors are handled on the backend
    if (verifyData.success) {
      mutation.mutate(verifyData.data);
      setFormErrors({
        username: "",
        email: "",
        password: "",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-6 bg-[#1b1918] rounded-[8px] p-5 text-white"
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
      <VariantLink
        variant="PRIMARY"
        aria="Submit user registartion"
        type="submit"
        label="Complete registration"
      />
      {serverError && (
        <p className="error" style={{ color: "red", marginBottom: "1rem" }}>
          {serverError}
        </p>
      )}{" "}
    </form>
  );
};

export default RegistrationForm;
