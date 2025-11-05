let library = [
    {
        "code": 1,
        "title": "crime and punishment",
        "author": "Fyodor Dostoevsky",
        "year": 1866,
        "available": true,
        "price": 9.99
    },
    {
        "code": 2,
        "title": "to kill a mockingbird",
        "author": "Harper Lee",
        "year": 1960,
        "available": false,
        "price": 7.99
    },
    {
        "code": 3,
        "title": "1984",
        "author": "George Orwell",
        "year": 1949,
        "available": true,
        "price": 8.99
    },
    {
        "code": 4,
        "title": "the great gatsby",
        "author": "F. Scott Fitzgerald",
        "year": 1925,
        "available": true,
        "price": 10.99
    }
];
function filterTable() {
    // lower case
    const input = document.getElementById('search-input');
    const filter = input.value.toLowerCase();
    
    // get table and rows
    const table = document.getElementById('library-table');
    const tr = table.getElementsByTagName('tr'); 

    // start from 1 to skip header
    for (let i = 1; i < tr.length; i++) {
        let rowContainsFilter = false;
        
        // Get all the <td> (data cells) in the current row
        const tds = tr[i].getElementsByTagName('td');
        
        //
        for (let j = 0; j < tds.length; j++) {
            const td = tds[j];
            if (td) {
                //get cell text
                const cellText = td.textContent || td.innerText;
                
                //check if the same
                if (cellText.toLowerCase().indexOf(filter) > -1) {
                    rowContainsFilter = true;
                    break; // if true stop
                }
            }
        }

        if (rowContainsFilter) {
            tr[i].style.display = ""; // Show the row
        } else {
            tr[i].style.display = "none"; // Hide the row
        }
    }
}

function renderTable() {
    const tableEl = document.getElementById('library-table');
    if (!tableEl) return;

    const theadTr = tableEl.querySelector('thead tr');
    const tbody = tableEl.querySelector('tbody');
// clear existing content   
    theadTr.innerHTML = '';
    tbody.innerHTML = '';

    //table headers
    const HEADERS = ["code", "title", "author", "year", "available", "price",];
    HEADERS.forEach(h => {
        const th = document.createElement('th');
        th.textContent = h;
        theadTr.appendChild(th);
    });
    //delete action header
    const thAction = document.createElement('th');
    thAction.textContent = 'Actions';
    theadTr.appendChild(thAction);
    

    library.forEach((book) => {
        const tr = document.createElement('tr');
        HEADERS.forEach((h) => {
            const td = document.createElement('td');
            let val = book[h];
            if (typeof val === 'boolean') val = val ? 'Yes' : 'No';
            td.textContent = (val === undefined || val === null) ? '' : val;
            tr.appendChild(td);
        });
        //delete button
        const actionTd = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            // conform dialog
            const ok = confirm(`Delete book ${book.title} (code ${book.code})?`);
            if (!ok) return;

            // remove book from array
            library = library.filter(b => String(b.code) !== String(book.code));
            
            // render tablb
            renderTable();
        });
        actionTd.appendChild(deleteButton);
        tr.appendChild(actionTd);
        tbody.appendChild(tr);
        filterTable();
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

        //if (!code || !title) {
        //    alert('Code and Title are required.');
        //    return;
        //}

        // no duplicate code
        if (library.some(b => String(b.code) === String(code))) {
            alert('A book with this code already exists. Choose a different code.');
            return;
        }

        const newBook = { code: code, title: title, author: author, year: year, available: available, price: price };
        library.push(newBook);
    renderTable();

        form.reset();
    alert('Book added.');
    });
}
setupAdminForm();   
renderTable();
document.getElementById('search-input').addEventListener('keyup', filterTable);