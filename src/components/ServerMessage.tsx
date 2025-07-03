import { ToastContainer, toast } from "react-toastify";

const ServerMessage = () => {
  const notify = () => toast("Wow so easy !");

  return (
    <div className="grid place-items-center h-dvh bg-zinc-900/15">
      <ToastContainer />
    </div>
  );
};

export default ServerMessage;
