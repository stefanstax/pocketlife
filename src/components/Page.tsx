import { type ReactNode } from "react";

const Page = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full min-h-[600px] flex flex-col justify-start items-start">
      {children}
    </div>
  );
};

export default Page;
