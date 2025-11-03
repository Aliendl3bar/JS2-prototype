
// Key used in localStorage:
const STORAGE_KEY = 'libraryBooks';

let books = [];
let searchQuery = '';

function setSearchQuery(q) {
    searchQuery = String(q || '').trim();
    renderTable();
}

function getStoredBooks() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : null;//parse the data from the json file
    } catch (err) {
        console.error('Error reading from localStorage', err);
        return null;
    }
}

function saveStoredBooks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));//saves the data of books as an json file 
    } catch (err) {
        console.error('Error saving to localStorage', err);
    }
}
//try local storage first, if not found fetch from json file
async function loadJsonData() {
    // Try localStorage first
    const stored = getStoredBooks();
    if (stored) {
        books = stored;
        renderTable();
        return;
    }

    // Fallback: fetch initial data from library.json and persist to localStorage
    try {
        const response = await fetch('library.json');
        const data = await response.json();
        books = Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error loading JSON data:', error);
        books = [];
    }
    saveStoredBooks();
    renderTable();
}

function renderTable() {
    const table = document.getElementById('library-table');
    if (!table) return;

    const theadTr = table.querySelector('thead tr');
    const tbody = table.querySelector('tbody');

    theadTr.innerHTML = '';
    tbody.innerHTML = '';

    //table headers
    const HEADERS = ["code", "title", "author", "year", "available", "price",];
    HEADERS.forEach(h => {
        const th = document.createElement('th');
        th.textContent = h;
        theadTr.appendChild(th);
    });
    //action header to add delete button
    const thAction = document.createElement('th');
    thAction.textContent = 'Actions';
    theadTr.appendChild(thAction);

    //data empty 
    // apply search filter by title if any
    const filtered = searchQuery
        ? books.filter(b => (b.title || '').toString().toLowerCase().includes(searchQuery.toLowerCase()))
        : books;

    if (!filtered || filtered.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = HEADERS.length + 1;
        td.textContent = searchQuery ? 'No matching books.' : 'No books available.';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    filtered.forEach((book) => {
        const tr = document.createElement('tr');
        HEADERS.forEach((h) => {
            const td = document.createElement('td');
            let val = book[h];
            if (typeof val === 'boolean') val = val ? 'Yes' : 'No';
            td.textContent = (val === undefined || val === null) ? '' : val;
            tr.appendChild(td);
        });

        const actionTd = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            const ok = confirm(`Delete book ${book.title} (code ${book.code})?`);
            if (!ok) return;
            books = books.filter(b => String(b.code) !== String(book.code));
            saveStoredBooks();
            renderTable();
        });
        actionTd.appendChild(deleteButton);
        tr.appendChild(actionTd);

        tbody.appendChild(tr);
    });
}

function setupAdminForm() {
    const form = document.getElementById('book-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const codeEl = document.getElementById('code');
        const titleEl = document.getElementById('title');
        const authorEl = document.getElementById('author');
        const yearEl = document.getElementById('year');
        const availableEl = document.getElementById('available');
        const priceEl = document.getElementById('price');

        const code = codeEl ? (codeEl.value ? Number(codeEl.value) : '') : '';
        const title = titleEl ? titleEl.value.trim() : '';
        const author = authorEl ? authorEl.value.trim() : '';
        const year = yearEl ? (yearEl.value ? Number(yearEl.value) : '') : '';
        const available = availableEl ? !!availableEl.checked : false;
        const price = priceEl ? (priceEl.value ? Number(priceEl.value) : '') : '';

        if (!code || !title) {
            alert('Code and Title are required.');
            return;
        }

        // no duplicate code
        if (books.some(b => String(b.code) === String(code))) {
            alert('A book with this code already exists. Choose a different code.');
            return;
        }

        const newBook = { code: code, title: title, author: author, year: year, available: available, price: price };
        books.push(newBook);
        saveStoredBooks();
        renderTable();

        form.reset();
        alert('Book added and saved to localStorage.');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadJsonData();
    setupAdminForm();
    // create search control above the table
    const table = document.getElementById('library-table');
    if (table && table.parentNode) {
        const controls = document.createElement('div');
        controls.id = 'library-search-controls';
        controls.style.margin = '10px 0';

        const label = document.createElement('label');
        label.textContent = 'Search by title: ';
        label.htmlFor = 'library-search-input';

        const input = document.createElement('input');
        input.type = 'search';
        input.id = 'library-search-input';
        input.placeholder = 'Enter title to search...';
        input.style.marginRight = '6px';
        input.addEventListener('input', (e) => setSearchQuery(e.target.value));

        const clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.textContent = 'Clear';
        clearBtn.addEventListener('click', () => { input.value = ''; setSearchQuery(''); input.focus(); });

        controls.appendChild(label);
        controls.appendChild(input);
        controls.appendChild(clearBtn);

        table.parentNode.insertBefore(controls, table);
    }
});

document.getElementById('clearLocalStorageButton').addEventListener('click', function() {
    localStorage.clear();
    console.log('Local Storage cleared.');
    location.reload();
    });
