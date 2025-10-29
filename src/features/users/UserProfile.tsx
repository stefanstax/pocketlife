import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { formDiv, input, labelClasses } from "../../app/globalClasses";
import SensitiveBlock from "../../components/SensitiveBlock";
import { useEffect, useState, type FormEvent } from "react";
import SubmitButton from "../../components/SubmitButton";
import { toast } from "react-toastify";
import { useUpdateUserByIdMutation } from "./api/usersApi";
import { userSchema } from "./schemas/userSchemas";
import { useDispatch } from "react-redux";
import { updateUser, type User } from "../../app/authSlice";

const UserProfile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState<
    Pick<
      User,
      "id" | "username" | "name" | "email" | "recoveryUrl" | "securityName"
    >
  >({
    id: "",
    name: "",
    username: "",
    email: "",
    recoveryUrl: "",
    securityName: "",
  });

  const [privacies, setPrivacies] = useState({
    recoveryUrl: true,
    securityName: true,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    const newData: Pick<
      User,
      "id" | "username" | "name" | "email" | "recoveryUrl" | "securityName"
    > = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      recoveryUrl: user.recoveryUrl,
      securityName: user.securityName,
    };
    setFormData(newData);
  }, [user]);

  const [updateUserById] = useUpdateUserByIdMutation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const verifiedData = userSchema.safeParse(formData);

    if (!verifiedData.success) {
      toast.error("Invalid input data.");
      return;
    }

    try {
      const userData = updateUserById(verifiedData.data).unwrap();

      await toast.promise(userData, {
        success: "User has been updated.",
        pending: "User is being updated.",
      });
      dispatch(updateUser(await userData));
    } catch (error: any) {
      return toast.error(error?.data?.message ?? "Uncaught error.");
    }
  };

  return (
    <div className="w-full rounded-lg grid grid-cols-1 gap-4">
      <div className="grid grid-cols-1 gap-4">
        <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
          <div className={formDiv}>
            <label htmlFor="name" className={labelClasses}>
              Name
            </label>
            <input
              type="text"
              name="name"
              className={input}
              value={formData?.name}
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
              }
            />
          </div>
          <div className={formDiv}>
            <label htmlFor="username" className={labelClasses}>
              Username
            </label>
            <input
              type="text"
              name="username"
              className={input}
              value={formData?.username}
              onChange={(event) =>
                setFormData({ ...formData, username: event.target.value })
              }
            />
          </div>
          <div className={formDiv}>
            <label htmlFor="email" className={labelClasses}>
              Email
            </label>
            <input
              type="email"
              name="email"
              className={input}
              value={formData?.email}
              onChange={(event) =>
                setFormData({ ...formData, email: event.target.value })
              }
            />
          </div>
          <SensitiveBlock
            privacy={privacies?.recoveryUrl}
            setPrivacy={() =>
              setPrivacies((prev) => ({
                ...prev,
                recoveryUrl: !prev.recoveryUrl,
              }))
            }
          >
            <div className={formDiv}>
              <label htmlFor="recoveryUrl" className={labelClasses}>
                Recovery URL
              </label>
              <input
                type="text"
                name="recoveryUrl"
                className={input}
                value={formData?.recoveryUrl}
                onChange={(event) =>
                  setFormData({ ...formData, recoveryUrl: event.target.value })
                }
              />
            </div>
          </SensitiveBlock>
          <SensitiveBlock
            privacy={privacies?.securityName}
            setPrivacy={() =>
              setPrivacies((prev) => ({
                ...prev,
                securityName: !prev.securityName,
              }))
            }
          >
            <div className={formDiv}>
              <label htmlFor="securityName" className={labelClasses}>
                Security Name
              </label>
              <input
                type="text"
                name="securityName"
                className={input}
                value={formData?.securityName}
                onChange={(event) =>
                  setFormData({ ...formData, securityName: event.target.value })
                }
              />
            </div>
          </SensitiveBlock>
          <SubmitButton aria="Update user" label="Update user" />
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
