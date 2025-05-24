import RegistrationForm from "../features/registration/RegistrationForm";

const Registration = () => {
  return (
    <section className="w-full h-screen flex justify-center items-center flex-col gap-4">
      <div className="max-w-[400px]">
        <RegistrationForm />
      </div>
    </section>
  );
};

export default Registration;
