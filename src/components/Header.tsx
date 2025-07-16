const Header = ({ label }: { label: string }) => {
  return (
    <div className="flex justify-center items-center min-h-[300px] bg-gray-950">
      <h1 className="text-4xl font-black text-white">{label}</h1>
    </div>
  );
};

export default Header;
