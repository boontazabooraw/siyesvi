import { useState, useMemo } from "react";

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
        <p>
          ✅ In both: {result.inBoth.length} · ❌ Summary only:{" "}
          {result.summaryOnly.length} · 📁 Files only: {result.filesOnly.length}
        </p>

        {result.summaryOnly.length > 0 && (
          <>
            <h5>❌ In Discharge Summary but no matching file</h5>
            <ul>
              {result.summaryOnly.map((s, i) => (
                <li key={i}>{s.name}</li>
              ))}
            </ul>
          </>
        )}

        {result.filesOnly.length > 0 && (
          <>
            <h5>📁 File exists but not in Discharge Summary</h5>
            <ul>
              {result.filesOnly.map((f, i) => (
                <li key={i}>
                  {f.name} <em style={{ color: "#888" }}>({f.path})</em>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
