import { useQueries, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "./store";

export const useLocalApi = (resource: string, id?: number) => {
  const { user } = useSelector((state: RootState) => state.auth);
  return useQuery({
    queryKey: id ? [resource, id, user?.id] : [resource, user?.id],
    queryFn: async () => {
      const url = new URL(`http://localhost:3000/${resource}`);
      if (id) url.pathname += `/${id}`;
      if (user?.id) url.searchParams.set("userId", user?.id.toString());

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`There was a problem loading ${resource}`);
      }

      return response.json();
    },
  });
};

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
