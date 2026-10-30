import { useState, useMemo } from "react";
import Stat from "./components/Stat";
import Detail from "./components/Detail";
import Field from "./components/Field";

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
    <div className="min-h-screen bg-neutral-950 p-6 text-neutral-200">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Inputs */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field label="File paths" hint="Windows “Copy as path”">
            <textarea
              rows={12}
              className="w-full resize-none rounded-md border border-neutral-800 bg-neutral-900 p-3 font-mono text-xs text-neutral-300 placeholder-neutral-600 focus:border-neutral-600 focus:outline-none"
              value={pathsRaw}
              onChange={(e) => setPathsRaw(e.target.value)}
              placeholder={
                '"Z:\\# CSV\\11 NOV\\NOVEMBER 1\\santos, flordeliza mae bonifacio.csv"'
              }
            />
          </Field>
          <Field label="Discharge Summary" hint="SURNAME, FIRST MIDDLE">
            <textarea
              rows={12}
              className="w-full resize-none rounded-md border border-neutral-800 bg-neutral-900 p-3 font-mono text-xs text-neutral-300 placeholder-neutral-600 focus:border-neutral-600 focus:outline-none"
              value={summaryRaw}
              onChange={(e) => setSummaryRaw(e.target.value)}
              placeholder={"SANTOS, FLORDELIZA MAE BONIFACIO"}
            />
          </Field>
        </div>

        {/* Stat row */}
        <div className="grid grid-cols-3 gap-4">
          <Stat
            label="In both"
            value={result.inBoth.length}
            dot="bg-emerald-500"
          />
          <Stat
            label="Summary only"
            value={result.summaryOnly.length}
            dot="bg-rose-500"
          />
          <Stat
            label="Files only"
            value={result.filesOnly.length}
            dot="bg-amber-500"
          />
        </div>

        {/* Detail lists */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Detail
            title="Summary only"
            dot="bg-rose-500"
            items={result.summaryOnly.map((s) => ({
              key: s.key,
              label: s.name,
            }))}
            empty="Every summary entry has a matching file."
          />
          <Detail
            title="Files only"
            dot="bg-amber-500"
            items={result.filesOnly.map((f) => ({
              key: f.key,
              label: f.name,
              title: f.path,
            }))}
            empty="Every file is accounted for."
          />
        </div>
      </div>
    </div>
  );
}
