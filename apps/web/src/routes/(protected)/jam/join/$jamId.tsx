import { Status } from "@/features/jam/components/jam-status";
import { useGeoLocation } from "@/hooks/use-geo-location";
import { api } from "@/lib/api";
import { isWithinDistanceKm } from "@/lib/utils";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/jam/join/$jamId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const res = await api.jam({ id: params.jamId }).get();
    if (!res.data) throw redirect({ to: "/dashboard", replace: true })
    return res.data;
  },
});

function RouteComponent() {
  const locData = useGeoLocation();
  const jamDetails = Route.useLoaderData();
  if (!jamDetails) return null;
  const hasLocation = !!locData.lat && !!locData.lon && !!jamDetails.latitude && !!jamDetails?.longitude;
  const isNearby =
    hasLocation &&
    isWithinDistanceKm(
      jamDetails.latitude,
      jamDetails.longitude,
      locData.lat!,
      locData.lon!,
      0.5
    );

  return (
    <div className="flex justify-center items-center px-4 min-h-[70vh]">
      <div className="bg-white shadow-sm p-6 border border-neutral-200 rounded-2xl w-full max-w-md">
        {!jamDetails && (
          <Status
            title="Invalid Jam"
            description="This jam session does not exist or has been removed."
            variant="error"
          />
        )}

        {/* No Location Permission */}
        {jamDetails && !hasLocation && (
          <Status
            title="Location Required"
            description="Please allow location access to verify your proximity."
            variant="warning"
          />
        )}

        {/* Too Far */}
        {jamDetails && hasLocation && !isNearby && (
          <Status
            title="Too Far Away"
            description="You must be within 500 meters of the jam location to join."
            variant="error"
          />
        )}

        {/* Success */}
        {jamDetails && hasLocation && isNearby && (
          <Status
            title="You're Good to Go 🎉"
            description="You’re near the jam location and can join the session."
            variant="success"
          />
        )}
      </div>
    </div>
  );
}
