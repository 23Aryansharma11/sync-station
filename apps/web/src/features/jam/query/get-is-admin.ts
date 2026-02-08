import { api } from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";

export const isAdminQuery = (jamId: string) => (queryOptions<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
        const res = await api.jam.isAdmin({ jamId }).get();
        return res.data?.isAdmin || false
    },
    staleTime: 5 * 60 * 1000,
}))
