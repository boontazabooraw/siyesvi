function Field({ label, hint, children }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label className="text-xs font-medium uppercase tracking-wider text-neutral-400">
          {label}
        </label>
        <span className="text-[11px] text-neutral-600">{hint}</span>
      </div>
      {children}
    </div>
  );
}

export default Field;
