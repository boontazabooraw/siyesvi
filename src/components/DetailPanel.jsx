function DetailPanel({ title, icon, tone, items, emptyText }) {
  const tones = {
    rose: "border-rose-200 bg-white text-rose-700",
    amber: "border-amber-200 bg-white text-amber-700",
  };
  return (
    <div className={`rounded-xl border shadow-sm ${tones[tone]}`}>
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
        <span>{icon}</span>
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 tabular-nums">
          {items.length}
        </span>
      </div>
      {items.length === 0 ? (
        <p className="px-4 py-6 text-sm text-slate-400">{emptyText}</p>
      ) : (
        <ul className="max-h-72 divide-y divide-slate-100 overflow-y-auto">
          {items.map((item) => (
            <li
              key={item.key}
              title={item.title}
              className="px-4 py-2 font-mono text-xs text-slate-700 hover:bg-slate-50"
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DetailPanel;
