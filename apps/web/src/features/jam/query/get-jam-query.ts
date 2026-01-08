import { api } from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";

export const getJamQuery = queryOptions({
    queryKey: ["jams"],
    queryFn: async () => {
        const res = await api.jam.get();
        return res.data ??[]
    }
})