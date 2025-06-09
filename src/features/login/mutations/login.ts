import type { LoginState } from "../loginTypes";

export const login = async (data: LoginState) => {
  const response = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  let result;

  try {
    result = await response.json();
  } catch {
    const fallback = await response.text();
    throw new Error(fallback || "Server returned invalid JSON.");
  }

  if (!response.ok) {
    throw new Error(result.message || "Login failed.");
  }

  return result.user;
};
