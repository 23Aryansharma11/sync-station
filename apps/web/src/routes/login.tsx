import { createFileRoute, redirect } from "@tanstack/react-router";
import { useTheme } from "@/components/theme-provider";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { MagicCard } from "@/components/ui/magic-card";

import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/login")({
	component: LoginPage,
	beforeLoad: async () => {
		const { data } = await authClient.getSession();
		if (data) {
			throw redirect({
				to: "/dashboard",
				replace: true,
			});
		}
	},
});

function LoginPage() {
	const handleLogin = async () => {
		const { data, error } = await authClient.signIn.social({
			provider: "google",
			callbackURL: window.location.origin,
			fetchOptions: {
				onSuccess: (ctx) => {
					// TODO
				},
			},
		});
	};

	const { theme } = useTheme();
	return (
		<div className="flex justify-center items-center bg-linear-to-br from-[hsl(var(--background))] to-[hsl(var(--accent))] px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
			<div className="space-y-8 w-full max-w-md">
				<Card className="shadow-none p-0 border-none rounded-2xl w-full max-w-sm">
					<MagicCard
						gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
						className="p-0"
					>
						<CardHeader className="p-4 [.border-b]:pb-4 border-border border-b">
							<CardTitle className="font-bold text-2xl">Login</CardTitle>
							<CardDescription>
								Login with Google and Start Jamming to your favourite tracks
							</CardDescription>
						</CardHeader>
						<CardContent className="p-4">
							<Button
								variant="outline"
								className="flex justify-center items-center gap-3 py-4 rounded-xl w-full"
								size="lg"
								onClick={handleLogin}
							>
								<img src="/google.png" alt="google logo" className="w-6" />
								<span className="text-base">Continue with Google</span>
							</Button>
						</CardContent>
					</MagicCard>
				</Card>
			</div>
		</div>
	);
}
