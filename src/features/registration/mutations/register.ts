import type { RegistrationState } from "../registrationTypes";

export const register = async (data: RegistrationState) => {
  const res = await fetch("http://localhost:3000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to register user");
  }

  return res.json();
};
