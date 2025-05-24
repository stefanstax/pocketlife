import { useQueries, useQuery } from "@tanstack/react-query";

export const useLocalApi = (resource: string) =>
  useQuery({
    queryKey: [resource],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/${resource}`);

      if (!response.ok) {
        throw new Error("There was a problem to load currencies");
      }

      return response.json();
    },
  });

export const useLocalApis = (firstApi: string, secondApi: string) =>
  useQueries({
    queries: [
      {
        queryKey: [firstApi],
        queryFn: () =>
          fetch(`http://localhost:3000/${firstApi}`).then((res) => res.json()),
      },
      {
        queryKey: [secondApi],
        queryFn: () =>
          fetch(`http://localhost:3000/${secondApi}`).then((res) => res.json()),
      },
    ],
  });
