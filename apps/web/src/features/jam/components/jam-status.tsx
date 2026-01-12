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
    success: "border-green-200 bg-green-50 text-green-900",
    error: "border-red-200 bg-red-50 text-red-900",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-900",
  };

  return (
    <div className={`rounded-xl border p-4 ${styles[variant]}`}>
      <h2 className="font-semibold text-lg">{title}</h2>
      <p className="opacity-90 mt-1 text-sm">{description}</p>
    </div>
  );
}
