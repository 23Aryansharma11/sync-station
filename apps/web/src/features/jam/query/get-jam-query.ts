import { api } from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";

// Optional: Define for better typing (from your jam dashboard context)
type Jam = {
  name: string;
  description: string;
  bgImage: string;
  id: string;
  createdAt: Date;
};

export const getJamQuery = queryOptions<Jam[]>({
  queryKey: ["jams"],
  queryFn: async () => {
    const res = await api.jam.get();
    if (Array.isArray(res.data)) return res.data ?? [];
    throw new Error(res.data?.error ?? "Invalid response: expected jams array");
  },
  staleTime: 5 * 60 * 1000, 
});
