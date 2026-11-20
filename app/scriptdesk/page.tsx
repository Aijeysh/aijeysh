"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  ELEMENT_TYPES,
  ElementType,
  Script,
  ScriptElement,
  ScriptSummary,
  TYPE_LABELS,
} from "../lib/scriptdesk/types";

type Status = "saved" | "saving" | "unsaved" | "error";

const STATUS_LABEL: Record<Status, string> = {
  saved: "All changes saved",
  saving: "Saving…",
  unsaved: "Unsaved changes",
  error: "Save failed. Click to retry",
};

// What Enter creates after each element type
const NEXT_ON_ENTER: Record<ElementType, ElementType> = {
  scene: "action",
  action: "action",
  character: "dialogue",
  parenthetical: "dialogue",
  dialogue: "character",
  transition: "scene",
};

const PLACEHOLDER: Record<ElementType, string> = {
  scene: "INT. LOCATION - DAY",
  action: "Describe what we see and hear.",
  character: "CHARACTER",
  parenthetical: "(beat)",
  dialogue: "What they say.",
  transition: "CUT TO:",
};

// Rough characters per line, used only for the page estimate
const LINE_WIDTH: Record<ElementType, number> = {
  scene: 60, action: 60, character: 38, parenthetical: 25, dialogue: 35, transition: 15,
};

const uid = () => crypto.randomUUID();

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...init });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }
  return res.json();
}

function estimatePages(els: ScriptElement[]) {
  let lines = 0;
  for (const e of els) {
    const wrapped = e.text
      .split("\n")
      .reduce((n, l) => n + Math.max(1, Math.ceil(l.length / LINE_WIDTH[e.type])), 0);
    lines += wrapped + (e.type === "dialogue" || e.type === "parenthetical" ? 0 : 1);
  }
  return Math.max(1, Math.ceil(lines / 54));
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });

export default function Home() {
  const [list, setList] = useState<ScriptSummary[]>([]);
  const [script, setScript] = useState<Script | null>(null);
  const [status, setStatus] = useState<Status>("saved");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState<"docx" | "fdx" | null>(null);

  const scriptRef = useRef<Script | null>(null);
  useLayoutEffect(() => {
    scriptRef.current = script;
  }, [script]);
  const dirty = useRef(false);
  const inFlight = useRef<Promise<void>>(Promise.resolve());
  const fields = useRef(new Map<string, HTMLTextAreaElement>());
  const pendingFocus = useRef<string | null>(null);

  /* ---------- saving ---------- */

  const doSave = useCallback(async () => {
    const s = scriptRef.current;
    if (!s || !dirty.current) return;
    dirty.current = false;
    setStatus("saving");
    try {
      const res = await api<{ updatedAt: string }>(`/api/scriptdesk/${s.id}`, {
        method: "PUT",
        body: JSON.stringify({ title: s.title, author: s.author, elements: s.elements }),
      });
      setList((l) =>
        l
          .map((x) =>
            x.id === s.id ? { ...x, title: s.title, author: s.author, updatedAt: res.updatedAt } : x
          )
          .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      );
      setError(null);
      setStatus(dirty.current ? "unsaved" : "saved");
    } catch (e) {
      dirty.current = true;
      setStatus("error");
      setError(e instanceof Error ? e.message : "Could not save");
    }
  }, []);

  // Saves run one after another so a slow request can never overwrite a newer one.
  const save = useCallback(() => {
    inFlight.current = inFlight.current.then(doSave);
    return inFlight.current;
  }, [doSave]);

  // Autosave 1.2s after the last change
  useEffect(() => {
    if (!dirty.current) return;
    const t = setTimeout(save, 1200);
    return () => clearTimeout(t);
  }, [script, save]);

  // Don't lose work when the tab is hidden or closed
  useEffect(() => {
    const onHide = () => document.visibilityState === "hidden" && save();
    const onUnload = (e: BeforeUnloadEvent) => {
      if (dirty.current) e.preventDefault();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("beforeunload", onUnload);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("beforeunload", onUnload);
    };
  }, [save]);

  /* ---------- loading / switching ---------- */

  const openScript = useCallback(
    async (id: string) => {
      await save();
      try {
        const s = await api<Script>(`/api/scriptdesk/${id}`);
        dirty.current = false;
        setScript(s);
        setActiveId(s.elements[0]?.id ?? null);
        setStatus("saved");
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not open screenplay");
      }
    },
    [save]
  );

  const createScript = useCallback(async () => {
    await save();
    try {
      const s = await api<Script>("/api/scriptdesk", { method: "POST", body: "{}" });
      dirty.current = false;
      setList((l) => [{ id: s.id, title: s.title, author: s.author, updatedAt: s.updatedAt }, ...l]);
      setScript(s);
      setActiveId(s.elements[0].id);
      setStatus("saved");
      pendingFocus.current = s.elements[0].id;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create screenplay");
    }
  }, [save]);

  useEffect(() => {
    (async () => {
      try {
        const items = await api<ScriptSummary[]>("/api/scriptdesk");
        setList(items);
        if (items.length) await openScript(items[0].id);
        else await createScript();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load screenplays");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteScript = async () => {
    if (!script || !confirm(`Delete “${script.title || "Untitled"}”? This cannot be undone.`)) return;
    try {
      await api(`/api/scriptdesk/${script.id}`, { method: "DELETE" });
      dirty.current = false;
      const rest = list.filter((x) => x.id !== script.id);
      setList(rest);
      setScript(null);
      if (rest.length) await openScript(rest[0].id);
      else await createScript();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete");
    }
  };

  /* ---------- editing ---------- */

  const mutate = (fn: (s: Script) => Script) => {
    setScript((s) => (s ? fn(s) : s));
    dirty.current = true;
    setStatus("unsaved");
  };

  const setText = (id: string, text: string) =>
    mutate((s) => ({ ...s, elements: s.elements.map((e) => (e.id === id ? { ...e, text } : e)) }));

  const setType = (id: string, type: ElementType) =>
    mutate((s) => ({ ...s, elements: s.elements.map((e) => (e.id === id ? { ...e, type } : e)) }));

  // Adds an element after `id`; when splitting, `before` stays and `after` moves down.
  const insertAfter = (id: string, type: ElementType, before?: string, after = "") => {
    const fresh: ScriptElement = { id: uid(), type, text: after };
    pendingFocus.current = fresh.id;
    mutate((s) => {
      const i = s.elements.findIndex((e) => e.id === id);
      const els = s.elements.map((e) => (e.id === id && before !== undefined ? { ...e, text: before } : e));
      els.splice(i + 1, 0, fresh);
      return { ...s, elements: els };
    });
  };

  const remove = (id: string) => {
    const s = scriptRef.current;
    if (!s || s.elements.length < 2) return;
    const i = s.elements.findIndex((e) => e.id === id);
    pendingFocus.current = (s.elements[i - 1] ?? s.elements[i + 1]).id;
    mutate((cur) => ({ ...cur, elements: cur.elements.filter((e) => e.id !== id) }));
  };

  // Move the caret into a newly created / neighbouring element after render
  useEffect(() => {
    const id = pendingFocus.current;
    if (!id) return;
    pendingFocus.current = null;
    const el = fields.current.get(id);
    if (el) {
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, [script]);

  const focusAt = (id: string | undefined, end: boolean) => {
    const el = id ? fields.current.get(id) : undefined;
    if (!el) return;
    el.focus();
    const pos = end ? el.value.length : 0;
    el.setSelectionRange(pos, pos);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, el: ScriptElement, index: number) => {
    const ta = e.currentTarget;
    const els = scriptRef.current?.elements ?? [];

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      save();
      return;
    }

    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (el.text.trim() === "" && el.type !== "action") {
        setType(el.id, "action"); // Enter on an empty line drops back to action
        return;
      }
      const a = ta.selectionStart;
      const b = ta.selectionEnd;
      const tail = el.text.slice(b);
      insertAfter(el.id, NEXT_ON_ENTER[el.type], tail ? el.text.slice(0, a) : undefined, tail);
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      const i = ELEMENT_TYPES.indexOf(el.type);
      const step = e.shiftKey ? -1 : 1;
      setType(el.id, ELEMENT_TYPES[(i + step + ELEMENT_TYPES.length) % ELEMENT_TYPES.length]);
      return;
    }

    if (e.key === "Backspace" && el.text === "" && els.length > 1) {
      e.preventDefault();
      remove(el.id);
      return;
    }

    if (e.key === "ArrowUp" && ta.selectionStart === 0 && ta.selectionEnd === 0 && index > 0) {
      e.preventDefault();
      focusAt(els[index - 1].id, true);
    }
    if (
      e.key === "ArrowDown" &&
      ta.selectionStart === ta.value.length &&
      ta.selectionEnd === ta.value.length &&
      index < els.length - 1
    ) {
      e.preventDefault();
      focusAt(els[index + 1].id, false);
    }
  };

  // Headings, character names and transitions are stored in capitals
  const onBlurNormalize = (el: ScriptElement) => {
    if (["scene", "character", "transition"].includes(el.type) && el.text !== el.text.toUpperCase()) {
      setText(el.id, el.text.toUpperCase());
    }
  };

  /* ---------- export ---------- */

  const exportAs = async (format: "docx" | "fdx") => {
    if (!script) return;
    setExporting(format);
    try {
      await save(); // make sure the server has the latest text
      const res = await fetch(`/api/scriptdesk/${script.id}/export?format=${format}`);
      if (!res.ok) throw new Error(`Export failed (${res.status})`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const slug = script.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      a.href = url;
      a.download = `${slug || "screenplay"}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed");
    } finally {
      setExporting(null);
    }
  };

  /* ---------- derived ---------- */

  const scenes = useMemo(
    () => (script?.elements ?? []).filter((e) => e.type === "scene"),
    [script]
  );
  const words = useMemo(
    () =>
      (script?.elements ?? []).reduce((n, e) => n + (e.text.trim() ? e.text.trim().split(/\s+/).length : 0), 0),
    [script]
  );
  const pages = useMemo(() => estimatePages(script?.elements ?? []), [script]);
  const activeType = script?.elements.find((e) => e.id === activeId)?.type;

  return (
    <div className="sd-app">
      <aside className="sd-side">
        <div className="sd-brand">Scriptdesk</div>
        <button className="sd-btn sd-primary sd-wide" onClick={createScript}>New screenplay</button>

        <nav aria-label="Screenplays">
          <ul className="sd-scripts">
            {list.map((s) => (
              <li key={s.id}>
                <button className={s.id === script?.id ? "sd-on" : ""} onClick={() => openScript(s.id)}>
                  {s.title || "Untitled"}
                  <small>Edited {fmtDate(s.updatedAt)}</small>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sd-outline">
          <h2>Scenes</h2>
          {scenes.length === 0 ? (
            <p className="sd-empty">Scene headings you add appear here.</p>
          ) : (
            <ol>
              {scenes.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => {
                      focusAt(s.id, true);
                      fields.current.get(s.id)?.scrollIntoView({ block: "center" });
                    }}
                  >
                    {s.text || "Untitled scene"}
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>
      </aside>

      <main className="sd-main">
        <header className="sd-bar">
          <div className="sd-meta">
            <input
              className="sd-title"
              aria-label="Title"
              placeholder="Untitled screenplay"
              value={script?.title ?? ""}
              onChange={(e) => mutate((s) => ({ ...s, title: e.target.value }))}
            />
            <input
              className="sd-author"
              aria-label="Author"
              placeholder="Written by"
              value={script?.author ?? ""}
              onChange={(e) => mutate((s) => ({ ...s, author: e.target.value }))}
            />
          </div>

          <div className="sd-types" role="toolbar" aria-label="Element type">
            {ELEMENT_TYPES.map((t) => (
              <button
                key={t}
                aria-pressed={activeType === t}
                onMouseDown={(e) => e.preventDefault()} // keep the caret in the text
                onClick={() => activeId && setType(activeId, t)}
              >
                {TYPE_LABELS[t]}
              </button>
            ))}
          </div>

          <div className="sd-actions">
            <button className="sd-status" data-state={status} onClick={() => save()}>
              {STATUS_LABEL[status]}
            </button>
            <button className="sd-btn sd-primary" onClick={() => exportAs("docx")} disabled={!script || !!exporting}>
              {exporting === "docx" ? "Exporting…" : "Export .docx"}
            </button>
            <button className="sd-btn sd-primary" onClick={() => exportAs("fdx")} disabled={!script || !!exporting}>
              {exporting === "fdx" ? "Exporting…" : "Export .fdx"}
            </button>
            <button className="sd-btn" onClick={deleteScript} disabled={!script}>Delete</button>
          </div>
        </header>

        {error && <div className="sd-alert" role="alert">{error}</div>}

        <div className="sd-desk">
          <article className="sd-paper" aria-label="Screenplay">
            {script?.elements.map((el, i) => (
              <Field
                key={el.id}
                el={el}
                register={(node) => {
                  if (node) fields.current.set(el.id, node);
                  else fields.current.delete(el.id);
                }}
                onChange={(text) => setText(el.id, text)}
                onFocus={() => setActiveId(el.id)}
                onBlur={() => onBlurNormalize(el)}
                onKeyDown={(e) => onKeyDown(e, el, i)}
              />
            ))}
          </article>
        </div>

        <footer className="sd-foot">
          <span>{words.toLocaleString()} words</span>
          <span>About {pages} {pages === 1 ? "page" : "pages"}</span>
          <span>Tab changes the element type. Enter starts the next one. Ctrl/Cmd+S saves now.</span>
        </footer>
      </main>
    </div>
  );
}

function Field(props: {
  el: ScriptElement;
  register: (node: HTMLTextAreaElement | null) => void;
  onChange: (text: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}) {
  const { el } = props;
  const ref = useRef<HTMLTextAreaElement | null>(null);

  // Grow the textarea to fit its text
  useLayoutEffect(() => {
    const t = ref.current;
    if (!t) return;
    t.style.height = "0";
    t.style.height = `${t.scrollHeight}px`;
  }, [el.text, el.type]);

  return (
    <textarea
      ref={(node) => {
        ref.current = node;
        props.register(node);
      }}
      className={`sd-el sd-el-${el.type}`}
      rows={1}
      aria-label={TYPE_LABELS[el.type]}
      placeholder={PLACEHOLDER[el.type]}
      spellCheck={el.type === "action" || el.type === "dialogue"}
      value={el.text}
      onChange={(e) => props.onChange(e.target.value)}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      onKeyDown={props.onKeyDown}
    />
  );
}
