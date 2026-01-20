import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";

export function Status({
  title,
  description,
  variant,
}: {
  title: string;
  description: string;
  variant: "success" | "error" | "warning";
}) {
  const styles = {
    success: "border-green-200",
    error: "border-red-200",
    warning: "border-yellow-200",
  };

  return (
    <Card className={`rounded-xl border p-4 ${styles[variant]}`}>
      <h2 className="font-semibold text-lg">{title}</h2>
      <p className="opacity-90 mt-1 text-sm">{description}</p>
      {variant === "success" &&
        <Button className="w-full" variant={"secondary"}
          render={<Link to="/dashboard" />}
        >
          Join Jam
        </Button>
      }
    </Card>
  );
}
