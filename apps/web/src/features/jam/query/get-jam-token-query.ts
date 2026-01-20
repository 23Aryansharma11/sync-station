import { api } from "@/lib/api";
import { queryOptions } from "@tanstack/react-query";

export const getJamTokenQuery = (id: string, lat: number, lon: number) =>
    queryOptions({
        queryKey: ["jam-token", id, lat, lon],
        queryFn: async ({ queryKey }) => {
            const [, jamId, latitude, longitude] = queryKey as [
                string,
                string,
                number,
                number
            ];

            const res = await api
                .jam({ id: jamId })["join-token"]
                .post(
                    { lat: latitude, lon: longitude },
                    { query: { id: jamId } }
                );

            if (res.status === 200 && res.data?.token) {
                return res.data.token;
            }
            return null
        },
        enabled: false,
    });
