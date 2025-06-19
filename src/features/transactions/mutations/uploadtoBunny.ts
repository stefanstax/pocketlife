// ✅ uploadToBunny.ts
import { nanoid } from "@reduxjs/toolkit";

export const uploadFileToBunny = async ({
  file,
  userId,
}: {
  file: File;
  userId: string;
}): Promise<{ id: string; name: string; url: string } | null> => {
  const id = nanoid(10); // ✅ Generate ID inside the function
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", file.name);
  formData.append("userId", userId);

  try {
    const res = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
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
