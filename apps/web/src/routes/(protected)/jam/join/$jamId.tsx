import { createFileRoute } from '@tanstack/react-router'
//! Here we check if user has allowed the location and if that matches the location or jam device, location will be stored in session
export const Route = createFileRoute('/(protected)/jam/join/$jamId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    // get jam session info
  }
})

function RouteComponent() {
  return <div>Hello "/(protected)/jam/join/$jamId"!</div>
}
