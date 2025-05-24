import { useQuery } from "@tanstack/react-query";

const TransactionList = () => {
  const { data, isPending, isLoading, error } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/transactions/");

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      return response.json();
    },
  });

  if (isPending) return <h1>Loading...</h1>;
  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <p>
              {item.id} - {item.amount}
              {item.title} - {item.currency} - {item.type}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
