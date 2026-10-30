function Stat({ label, value, dot }) {
  return (
    <div className=" border border-neutral-800 bg-neutral-900 px-4 py-3">
      <div className="flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        <span className="text-[11px] uppercase tracking-wider text-neutral-500">
          {label}
        </span>
      </div>
      <div className="mt-1 text-2xl font-semibold tabular-nums text-neutral-100">
        {value}
      </div>
    </div>
  );
}

export default Stat;
