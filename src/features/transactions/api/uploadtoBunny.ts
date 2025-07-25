import { nanoid } from "@reduxjs/toolkit";
import { store } from "../../../app/store";

export const uploadFileToBunny = async ({
  file,
  username,
}: {
  file: File;
  username: string;
}): Promise<{ id: string; name: string; url: string } | null> => {
  const id = nanoid(10);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", file.name);
  formData.append("username", username);
  const token = store.getState().auth.token;

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      return { id, name: file.name, url: data.url };
    } else {
      console.error("❌ Upload failed:", data);
      return null;
    }
  } catch (err) {
    console.error("❌ Upload error:", err);
    return null;
  }
};
