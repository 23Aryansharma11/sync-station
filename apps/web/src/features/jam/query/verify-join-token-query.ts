import { api } from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";

export const verifyJamTokenQuery = async (token: string) => {
  return queryOptions({
    queryKey: ["token"],
    queryFn: async () => {
      const res = await api.jam["valid-token"]({ token }).get()

      if (res.error) {
        throw new Error(res.error.value.message)
      }

     return res.data
    },
  })
};
