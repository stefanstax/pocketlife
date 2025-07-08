const BlurredSpinner = () => {
  return (
    <div className="absolute inset-0 z-999 flex items-center justify-center bg-navy backdrop-blur-lg">
      <div className="w-8 h-8 border-4 border-gray-950 border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default BlurredSpinner;
