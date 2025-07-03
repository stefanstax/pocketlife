const BlurredSpinner = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-navy backdrop-blur-sm z-50">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default BlurredSpinner;
