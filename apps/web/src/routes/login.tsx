import { useTheme } from "@/components/theme-provider";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/ui/magic-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  beforeLoad: async () => {
    const { data } = await authClient.getSession();
    if (data) {
      throw redirect({
        to: "/dashboard",
        replace: true
      })
    }
  }
});

function LoginPage() {
  const handleLogin = async () => {
    console.log("Click")
    const { data, error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: window.location.origin,
      fetchOptions: {
        onSuccess: (ctx) => {
          console.log("Login success");
          console.log(ctx.response)
        }
      }
    })
    console.log(data);
    console.log(error);
  }

  const { theme } = useTheme()
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[hsl(var(--background))] to-[hsl(var(--accent))] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Card className="w-full max-w-sm border-none p-0 shadow-none rounded-2xl">
          <MagicCard
            gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
            className="p-0"
          >
            <CardHeader className="border-border border-b p-4 [.border-b]:pb-4">
              <CardTitle className="font-bold text-2xl">Login</CardTitle>
              <CardDescription>
                Login with Google and Start Jamming to your favourite tracks
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <Button
                variant="outline"
                className="w-full justify-center gap-3 py-4 flex items-center"
                size="lg"
                onClick={handleLogin}
              >
                <img
                  src="/google.png"
                  alt="google logo"
                  className="w-6"
                />
                <span className="text-base">Continue with Google</span>
              </Button>
            </CardContent>
          </MagicCard>
        </Card>
      </div>
    </div>
  );
}
