import { type ReactNode } from "react";

const Page = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full mx-auto min-h-[600px] flex flex-wrap justify-center items-center p-4 lg:p-10">
      {children}
    </div>
  );
};

export default Page;
