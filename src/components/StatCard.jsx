function StatCard({ label, value, tone, icon }) {
  const tones = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    rose: "border-rose-200 bg-rose-50 text-rose-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
  };
  return (
    <div className={`rounded-xl border p-5 shadow-sm ${tones[tone]}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium opacity-80">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="mt-2 text-3xl font-bold tabular-nums">{value}</div>
    </div>
  );
}

export default StatCard;
