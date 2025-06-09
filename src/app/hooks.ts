import { useQueries, useQuery } from "@tanstack/react-query";

export const useLocalApi = (resource: string, id?: number) =>
  useQuery({
    queryKey: id ? [resource, id] : [resource],
    queryFn: async () => {
      const url = id
        ? `http://localhost:3000/${resource}/${id}`
        : `http://localhost:3000/${resource}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`There was a problem loading ${resource}`);
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
