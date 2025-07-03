import { type ReactNode } from "react";

const Page = ({ children }: { children: ReactNode }) => {
  return (
    <section className="w-11/12 lg:w-10/12 2xl:w-8/12 shadow-lg bg-white mx-auto my-4 rounded-lg">
      <div className="rounded-md min-h-[600px] p-4 items-center justify-between flex">
        {children}
      </div>
    </section>
  );
};

export default Page;
