import { useState, useMemo } from "react";
import StatCard from "./components/StatCard";
import DetailPanel from "./components/DetailPanel";

const parseLines = (raw) =>
  raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

const cleanPath = (line) => line.replace(/^"+|"+$/g, "").trim();

const filenameFromPath = (p) =>
  p
    .split("\\")
    .pop()
    .replace(/\.csv$/i, "")
    .trim();

const normalize = (s) =>
  s
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ", ")
    .trim();

export default function Comparator() {
  const [pathsRaw, setPathsRaw] = useState("");
  const [summaryRaw, setSummaryRaw] = useState("");

  const result = useMemo(() => {
    const files = parseLines(pathsRaw).map((raw) => {
      const path = cleanPath(raw);
      const name = filenameFromPath(path);
      return { path, name, key: normalize(name) };
    });

    const summary = parseLines(summaryRaw).map((raw) => {
      const name = raw.replace(/^"+|"+$/g, "").trim();
      return { name, key: normalize(name) };
    });

    const fileKeyMap = new Map(files.map((f) => [f.key, f]));
    const summaryKeyMap = new Map(summary.map((s) => [s.key, s]));

    const inBoth = [];
    const summaryOnly = [];
    const filesOnly = [];

    summary.forEach((s) => {
      if (fileKeyMap.has(s.key))
        inBoth.push({ summary: s, file: fileKeyMap.get(s.key) });
      else summaryOnly.push(s);
    });

    files.forEach((f) => {
      if (!summaryKeyMap.has(f.key)) filesOnly.push(f);
    });

    return { inBoth, summaryOnly, filesOnly };
  }, [pathsRaw, summaryRaw]);

  return (
    <div className="grid grid-rows-2 grid-cols-2 gap-5 h-screen items-center p-5">
      <div className="border">
        <label>Paste file paths (Windows “Copy as path”, one per line):</label>
        <textarea
          rows={14}
          className="w-full resize-none"
          value={pathsRaw}
          onChange={(e) => setPathsRaw(e.target.value)}
          placeholder={
            '"Z:\\# CSV\\11 NOV\\NOVEMBER 1\\santos, flordeliza mae bonifacio.csv"'
          }
        />
      </div>
      <div className="border">
        <label>Paste Discharge Summary names (SURNAME, FIRST MIDDLE):</label>
        <textarea
          rows={14}
          className="w-full resize-none"
          value={summaryRaw}
          onChange={(e) => setSummaryRaw(e.target.value)}
          placeholder={"SANTOS, FLORDELIZA MAE BONIFACIO"}
        />
      </div>

      <div className="border col-span-2 h-full content-center overflow-auto">
        <div className="min-h-screen bg-slate-50 p-6">
          <div className="mx-auto max-w-6xl space-y-6">
            {/* Inputs */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  File paths{" "}
                  <span className="text-slate-400">
                    (Windows “Copy as path”)
                  </span>
                </label>
                <textarea
                  rows={12}
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-xs text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  value={pathsRaw}
                  onChange={(e) => setPathsRaw(e.target.value)}
                  placeholder={
                    '"Z:\\# CSV\\11 NOV\\NOVEMBER 1\\santos, flordeliza mae bonifacio.csv"'
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Discharge Summary{" "}
                  <span className="text-slate-400">
                    (SURNAME, FIRST MIDDLE)
                  </span>
                </label>
                <textarea
                  rows={12}
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-xs text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  value={summaryRaw}
                  onChange={(e) => setSummaryRaw(e.target.value)}
                  placeholder={"SANTOS, FLORDELIZA MAE BONIFACIO"}
                />
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard
                label="In both"
                value={result.inBoth.length}
                tone="emerald"
                icon="✅"
              />
              <StatCard
                label="Summary only"
                value={result.summaryOnly.length}
                tone="rose"
                icon="❌"
              />
              <StatCard
                label="Files only"
                value={result.filesOnly.length}
                tone="amber"
                icon="📁"
              />
            </div>

            {/* Detail panels */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <DetailPanel
                title="In Discharge Summary but no matching file"
                icon="❌"
                tone="rose"
                items={result.summaryOnly.map((s) => ({
                  key: s.key,
                  label: s.name,
                }))}
                emptyText="Every summary entry has a matching file."
              />
              <DetailPanel
                title="File exists but not in Discharge Summary"
                icon="📁"
                tone="amber"
                items={result.filesOnly.map((f) => ({
                  key: f.key,
                  label: f.name,
                  title: f.path,
                }))}
                emptyText="Every file is accounted for in the summary."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
