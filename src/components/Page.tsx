import { type ReactNode } from "react";

const Page = ({ children }: { children: ReactNode }) => {
  return (
    <section className="w-11/12 lg:w-6/12 mx-auto my-4 p-4 rounded-lg bg-[#ffffff20]">
      <div className="rounded-md bg-white min-h-[600px] flex-1 p-6 items-start justify-between flex">
        {children}
      </div>
    </section>
  );
};

export default Page;
