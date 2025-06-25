interface ErrorMessageProps {
  field: string;
}
const ErrorMessage = ({ field }: ErrorMessageProps) => {
  if (!field?.length) return null;

  return <p className="text-red-500">{field}</p>;
};

export default ErrorMessage;
