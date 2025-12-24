const KEY = "notes.v1";

const $ = (id) => document.getElementById(id);
const listEl = $("list");
const qEl = $("q");
const titleEl = $("title");
const bodyEl = $("body");
const metaEl = $("meta");
const countEl = $("count");

const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? []; }
  catch { return []; }
};
const save = (notes) => localStorage.setItem(KEY, JSON.stringify(notes));
const uid = () => crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2);

let notes = load();
let selectedId = notes[0]?.id ?? null;

function nowISO(){ return new Date().toISOString(); }

function createNote(){
  const n = { id: uid(), title: "Untitled", body: "", pinned: false, updatedAt: nowISO() };
  notes.unshift(n);
  selectedId = n.id;
  save(notes);
  render();
  titleEl.focus();
}

function deleteSelected(){
  if (!selectedId) return;
  notes = notes.filter(n => n.id !== selectedId);
  selectedId = notes[0]?.id ?? null;
  save(notes);
  render();
}

function togglePin(){
  const n = notes.find(x => x.id === selectedId);
  if (!n) return;
  n.pinned = !n.pinned;
  n.updatedAt = nowISO();
  save(notes);
  render();
}

function updateSelected(patch){
  const n = notes.find(x => x.id === selectedId);
  if (!n) return;
  Object.assign(n, patch, { updatedAt: nowISO() });
  save(notes);
  renderList(); // keep editor cursor stable
}

function formatTime(iso){
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "" : d.toLocaleString();
}

function getVisibleNotes(){
  const q = qEl.value.trim().toLowerCase();
  let arr = [...notes];

  // pinned first, then most recently updated
  arr.sort((a,b) => (b.pinned - a.pinned) || (b.updatedAt.localeCompare(a.updatedAt)));

  if (!q) return arr;
  return arr.filter(n =>
    (n.title ?? "").toLowerCase().includes(q) ||
    (n.body ?? "").toLowerCase().includes(q)
  );
}

function renderList(){
  const visible = getVisibleNotes();
  countEl.textContent = `${notes.length} notes`;

  listEl.innerHTML = "";
  visible.forEach(n => {
    const li = document.createElement("li");
    li.style.cursor = "pointer";
    li.style.borderColor = (n.id === selectedId) ? "color-mix(in srgb, var(--accent) 40%, var(--border))" : "";
    li.innerHTML = `
      <div class="row" style="justify-content:space-between;">
        <strong>${(n.pinned ? "📌 " : "") + escapeHtml(n.title || "Untitled")}</strong>
        <span class="small">${new Date(n.updatedAt).toLocaleDateString()}</span>
      </div>
      <div class="small" style="margin-top:6px;">
        ${escapeHtml((n.body || "").slice(0, 70))}${(n.body || "").length > 70 ? "…" : ""}
      </div>
    `;
    li.addEventListener("click", () => {
      selectedId = n.id;
      render();
    });
    listEl.appendChild(li);
  });
}

function renderEditor(){
  const n = notes.find(x => x.id === selectedId);
  const disabled = !n;

  titleEl.disabled = disabled;
  bodyEl.disabled = disabled;

  titleEl.value = n?.title ?? "";
  bodyEl.value = n?.body ?? "";

  metaEl.textContent = n ? `Last updated: ${formatTime(n.updatedAt)} • ${n.pinned ? "Pinned" : "Not pinned"}` : "No note selected";
}

function render(){
  renderList();
  renderEditor();
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
}

// Debounced autosave on typing
let t = null;
function scheduleUpdate(){
  clearTimeout(t);
  t = setTimeout(() => {
    if (!selectedId) return;
    updateSelected({ title: titleEl.value, body: bodyEl.value });
  }, 180);
}

$("add").addEventListener("click", createNote);
$("del").addEventListener("click", deleteSelected);
$("pin").addEventListener("click", togglePin);
qEl.addEventListener("input", renderList);

titleEl.addEventListener("input", scheduleUpdate);
bodyEl.addEventListener("input", scheduleUpdate);

if (!selectedId && notes.length === 0) createNote();
else render();