import { type ReactNode } from "react";

const Page = ({ children }: { children: ReactNode }) => {
  return (
    <section className="w-11/12 lg:w-10/12 mx-auto my-4 rounded-lg">
      <div className="rounded-md bg-white min-h-[600px] p-4 items-start justify-between flex">
        {children}
      </div>
    </section>
  );
};

export default Page;
