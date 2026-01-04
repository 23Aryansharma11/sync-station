import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  beforeLoad: async () => {
    const { data } = await authClient.getSession();
    if (data) {
      return redirect({
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
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[hsl(var(--background))] to-[hsl(var(--accent))] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Header */}
        <div className="mx-auto flex flex-col items-center space-y-3 text-center">
          <div className="w-20 h-20 bg-linear-to-r from-primary to-secondary rounded-2xl flex items-center justify-center shadow-xl"> {/* Use theme colors */}
            <span className="text-3xl font-bold text-primary-foreground">S</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Sync Station
          </h2>
          <p className="text-lg text-muted-foreground max-w-sm">
            Sync your world. Seamlessly JAM in real-time.
          </p>
        </div>

        {/* Card */}
        <div className="bg-card backdrop-blur-xl shadow-2xl border border-border/50 rounded-3xl px-8 py-10">
          <div className="space-y-6">
            {/* Google Button - Use shadcn Button */}
            <Button
              variant="outline"
              className="w-full justify-center gap-3 h-12 flex items-center"
              size="lg"
              onClick={handleLogin}
            >
              <img
                src="/google.png"
                alt="google logo"
                className="w-10"
              />
              <span>Continue with Google</span>
            </Button>

            {/* Divider */}
            <div className="relative flex py-4 items-center">
              <div className="grow border-t border-border/60" />
              <span className="shrink-0 px-4 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground bg-card/80 backdrop-blur-sm rounded-full">
                or continue later
              </span>
              <div className="grow border-t border-border/60" />
            </div>

            {/* Footer */}
            <div className="text-center space-y-2 pt-6">
              <p className="text-xs text-muted-foreground">
                By continuing, you agree to our{' '}
                <a href="#" className="font-medium text-primary hover:text-primary/80 underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="font-medium text-primary hover:text-primary/80 underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
