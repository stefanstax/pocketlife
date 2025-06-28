const ServerMessage = ({
  serverMessage,
  isError,
}: {
  serverMessage: string;
  isError: boolean;
}) => {
  return (
    <p
      className={`bg-black rounded-sm p-2 w-fit ${
        isError ? "text-red-400" : "text-green-400"
      } font-[500]`}
    >
      {serverMessage}
    </p>
  );
};

export default ServerMessage;
