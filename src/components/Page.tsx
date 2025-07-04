import { type ReactNode } from "react";

const Page = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full min-h-[600px] flex justify-center items-center p-4 lg:p-10">
      {/* <div className="rounded-md min-h-[600px] p-4 lg:p-10 items-center justify-center flex"> */}
      {children}
      {/* </div> */}
    </div>
  );
};

export default Page;
