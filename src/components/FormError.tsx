const FormError = ({ fieldError }: { fieldError?: string }) => {
  return fieldError ? (
    <p className="my-1 font-[600] text-sm text-red-400">*{fieldError}</p>
  ) : null;
};

export default FormError;
