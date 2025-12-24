const KEY = "expenses.v1";
const $ = (id) => document.getElementById(id);

const fmt = new Intl.NumberFormat(undefined, { style: "currency", currency: "INR" });

const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) ?? []; } catch { return []; } };
const save = (tx) => localStorage.setItem(KEY, JSON.stringify(tx));
const uid = () => crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2);

let tx = load();

function setToday() {
    const d = new Date();
    const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    $("date").value = iso;
}

function totals() {
    let income = 0, expense = 0;
    for (const t of tx) {
        const amt = Number(t.amount) || 0;
        if (t.type === "income") income += amt;
        else expense += amt;
    }
    return { income, expense, balance: income - expense };
}

function renderKPIs() {
    const { income, expense, balance } = totals();
    $("income").textContent = fmt.format(income);
    $("expense").textContent = fmt.format(expense);
    $("balance").textContent = fmt.format(balance);
}

function visibleTx() {
    const q = $("filter").value.trim().toLowerCase();
    let arr = [...tx].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
    if (!q) return arr;
    return arr.filter(t =>
        (t.category ?? "").toLowerCase().includes(q) ||
        (t.note ?? "").toLowerCase().includes(q) ||
        (t.type ?? "").toLowerCase().includes(q)
    );
}

function renderTable() {
    const rows = $("rows");
    rows.innerHTML = "";

    for (const t of visibleTx()) {
        const tr = document.createElement("tr");
        const amt = Number(t.amount) || 0;
        const sign = t.type === "expense" ? "-" : "+";
        tr.innerHTML = `
      <td>${escapeHtml(t.date || "")}</td>
      <td><span class="badge">${escapeHtml(t.type)}</span></td>
      <td>${escapeHtml(t.category || "")}</td>
      <td style="font-weight:800; color:${t.type === "expense" ? "var(--bad)" : "var(--good)"};">
        ${sign}${fmt.format(amt)}
      </td>
      <td><button class="btn danger" data-del="${t.id}">Delete</button></td>
    `;
        rows.appendChild(tr);
    }

    rows.querySelectorAll("[data-del]").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-del");
            tx = tx.filter(x => x.id !== id);
            save(tx);
            render();
        });
    });
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
}

function addTx() {
    const type = $("type").value;
    const amount = Number($("amount").value);
    const category = $("cat").value.trim();
    const date = $("date").value;
    const note = $("note").value.trim();

    if (!Number.isFinite(amount) || amount <= 0) return msg("Enter a valid amount.", true);
    if (!category) return msg("Category is required.", true);
    if (!date) return msg("Date is required.", true);

    tx.unshift({ id: uid(), type, amount, category, date, note });
    save(tx);
    $("amount").value = "";
    $("cat").value = "";
    $("note").value = "";
    msg("Added.", false);
    render();
}

function msg(text, isErr) {
    $("msg").textContent = text;
    $("msg").style.color = isErr ? "var(--bad)" : "var(--muted)";
}

function render() {
    renderKPIs();
    renderTable();
}

$("add").addEventListener("click", addTx);
$("filter").addEventListener("input", renderTable);

$("export").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(tx, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "transactions.json";
    a.click();
    URL.revokeObjectURL(a.href);
});

$("import").addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (!Array.isArray(data)) throw new Error("Invalid file");
        tx = data;
        save(tx);
        render();
        msg("Imported.", false);
    } catch {
        msg("Import failed (invalid JSON).", true);
    } finally {
        e.target.value = "";
    }
});

setToday();
render();