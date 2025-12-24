const KEY = "library.v1";
const $ = (id) => document.getElementById(id);
const uid = () => crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2);

function load() {
    try {
        return JSON.parse(localStorage.getItem(KEY)) ?? { books: [], members: [], loans: [] };
    } catch {
        return { books: [], members: [], loans: [] };
    }
}
function save(state) { localStorage.setItem(KEY, JSON.stringify(state)); }

let state = load();

function msg(el, text, isErr) {
    el.textContent = text;
    el.style.color = isErr ? "var(--bad)" : "var(--muted)";
}

function switchTab(tab) {
    ["books", "members", "loans"].forEach(id => $(id).style.display = (id === tab) ? "" : "none");
}

document.querySelectorAll("[data-tab]").forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.getAttribute("data-tab")));
});

function addBook() {
    const title = $("bTitle").value.trim();
    const author = $("bAuthor").value.trim();
    const isbn = $("bIsbn").value.trim();
    const copies = Number($("bCopies").value);

    if (!title) return msg($("bMsg"), "Title is required.", true);
    if (!author) return msg($("bMsg"), "Author is required.", true);
    if (!Number.isInteger(copies) || copies <= 0) return msg($("bMsg"), "Copies must be a positive integer.", true);

    state.books.push({
        id: uid(), title, author, isbn,
        copiesTotal: copies, copiesAvailable: copies
    });
    save(state);
    $("bTitle").value = $("bAuthor").value = $("bIsbn").value = $("bCopies").value = "";
    msg($("bMsg"), "Book added.", false);
    render();
}

function addMember() {
    const name = $("mName").value.trim();
    const email = $("mEmail").value.trim();
    if (!name) return msg($("mMsg"), "Name is required.", true);

    state.members.push({ id: uid(), name, email });
    save(state);
    $("mName").value = $("mEmail").value = "";
    msg($("mMsg"), "Member added.", false);
    render();
}

function borrow() {
    const bookId = $("loanBook").value;
    const memberId = $("loanMember").value;

    const book = state.books.find(b => b.id === bookId);
    const member = state.members.find(m => m.id === memberId);

    if (!book) return msg($("lMsg"), "Select a book.", true);
    if (!member) return msg($("lMsg"), "Select a member.", true);
    if (book.copiesAvailable <= 0) return msg($("lMsg"), "No copies available.", true);

    book.copiesAvailable -= 1;
    state.loans.push({ id: uid(), bookId, memberId, borrowedAt: new Date().toISOString(), returnedAt: null });
    save(state);
    msg($("lMsg"), "Borrowed.", false);
    render();
}

function returnLoan(loanId) {
    const loan = state.loans.find(l => l.id === loanId);
    if (!loan || loan.returnedAt) return;

    const book = state.books.find(b => b.id === loan.bookId);
    if (book) book.copiesAvailable += 1;

    loan.returnedAt = new Date().toISOString();
    save(state);
    render();
}

function delBook(id) {
    // prevent deletion if active loans exist for this book
    const hasActive = state.loans.some(l => l.bookId === id && !l.returnedAt);
    if (hasActive) return msg($("bMsg"), "Cannot delete: book is currently loaned out.", true);

    state.books = state.books.filter(b => b.id !== id);
    save(state);
    render();
}

function delMember(id) {
    const hasActive = state.loans.some(l => l.memberId === id && !l.returnedAt);
    if (hasActive) return msg($("mMsg"), "Cannot delete: member has active loans.", true);

    state.members = state.members.filter(m => m.id !== id);
    save(state);
    render();
}

function render() {
    // Books table
    const br = $("bookRows");
    br.innerHTML = "";
    state.books.forEach(b => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td><strong>${escapeHtml(b.title)}</strong><div class="small">${escapeHtml(b.isbn || "")}</div></td>
      <td>${escapeHtml(b.author)}</td>
      <td><span class="badge">${b.copiesAvailable} / ${b.copiesTotal}</span></td>
      <td><button class="btn danger" data-delbook="${b.id}">Delete</button></td>
    `;
        br.appendChild(tr);
    });
    br.querySelectorAll("[data-delbook]").forEach(btn => {
        btn.addEventListener("click", () => delBook(btn.getAttribute("data-delbook")));
    });

    // Members table
    const mr = $("memberRows");
    mr.innerHTML = "";
    state.members.forEach(m => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td><strong>${escapeHtml(m.name)}</strong></td>
      <td>${escapeHtml(m.email || "")}</td>
      <td><button class="btn danger" data-delmember="${m.id}">Delete</button></td>
    `;
        mr.appendChild(tr);
    });
    mr.querySelectorAll("[data-delmember]").forEach(btn => {
        btn.addEventListener("click", () => delMember(btn.getAttribute("data-delmember")));
    });

    // Borrow selects
    $("loanBook").innerHTML = `<option value="">Select book</option>` + state.books
        .map(b => `<option value="${b.id}">${escapeHtml(b.title)} (${b.copiesAvailable}/${b.copiesTotal})</option>`)
        .join("");

    $("loanMember").innerHTML = `<option value="">Select member</option>` + state.members
        .map(m => `<option value="${m.id}">${escapeHtml(m.name)}</option>`)
        .join("");

    // Loans table (active only)
    const lr = $("loanRows");
    lr.innerHTML = "";
    state.loans.filter(l => !l.returnedAt).forEach(l => {
        const book = state.books.find(b => b.id === l.bookId);
        const member = state.members.find(m => m.id === l.memberId);
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${escapeHtml(book?.title || "Unknown")}</td>
      <td>${escapeHtml(member?.name || "Unknown")}</td>
      <td>${new Date(l.borrowedAt).toLocaleString()}</td>
      <td><button class="btn primary" data-return="${l.id}">Return</button></td>
    `;
        lr.appendChild(tr);
    });
    lr.querySelectorAll("[data-return]").forEach(btn => {
        btn.addEventListener("click", () => returnLoan(btn.getAttribute("data-return")));
    });
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
}

$("addBook").addEventListener("click", addBook);
$("addMember").addEventListener("click", addMember);
$("borrow").addEventListener("click", borrow);

render();