function Detail({ title, dot, items, empty }) {
  return (
    <div className="rounded-md border border-neutral-800 bg-neutral-900">
      <div className="flex items-center gap-2 border-b border-neutral-800 px-4 py-2.5">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        <h3 className="text-xs font-medium uppercase tracking-wider text-neutral-400">
          {title}
        </h3>
        <span className="ml-auto text-[11px] tabular-nums text-neutral-600">
          {items.length}
        </span>
      </div>
      {items.length === 0 ? (
        <p className="px-4 py-6 text-xs text-neutral-600">{empty}</p>
      ) : (
        <ul className="max-h-72 divide-y divide-neutral-800/60 overflow-y-auto">
          {items.map((item) => (
            <li
              key={item.key}
              title={item.title}
              className="px-4 py-2 font-mono text-xs text-neutral-400 transition-colors hover:bg-neutral-800/50 hover:text-neutral-200"
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Detail;
