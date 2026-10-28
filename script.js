let items = JSON.parse(localStorage.getItem('expenses')) || [];

document.getElementById('date').valueAsDate = new Date();

function renderUI() {
    const list = document.getElementById('list');
    const filter = document.getElementById('filter').value;
    const searchValue = document.getElementById('search').value.toLowerCase();
    const noRecords = document.getElementById('no-records');
    
    list.innerHTML = '';

    let income = 0, expense = 0;
    let visibleCount = 0;

    items.forEach((item, idx) => {
        if (item.type === 'Income') income += item.amount;
        else expense += item.amount;

        const matchesFilter = filter === 'All' || item.type === filter;
        const matchesSearch = item.description.toLowerCase().includes(searchValue) || 
                              item.category.toLowerCase().includes(searchValue);

        if (matchesFilter && matchesSearch) {
            visibleCount++;
            const badgeClass = item.type === 'Income' ? 'badge-income' : 'badge-expense';
            const sign = item.type === 'Income' ? '+' : '-';

            list.innerHTML += `
                <tr>
                    <td>${item.date}</td>
                    <td>${item.description}</td>
                    <td><span class="badge ${badgeClass}">${item.type}</span></td>
                    <td>${item.category}</td>
                    <td><strong>${sign} LKR ${item.amount.toFixed(2)}</strong></td>
                    <td><button class="btn-delete" onclick="deleteItem(${idx})">Delete</button></td>
                </tr>`;
        }
    });

    if (visibleCount === 0) {
        noRecords.style.display = 'block';
    } else {
        noRecords.style.display = 'none';
    }

    document.getElementById('total-income').innerText = `LKR ${income.toFixed(2)}`;
    document.getElementById('total-expenses').innerText = `LKR ${expense.toFixed(2)}`;
    document.getElementById('current-balance').innerText = `LKR ${(income - expense).toFixed(2)}`;

    localStorage.setItem('expenses', JSON.stringify(items));
}

document.getElementById('expense-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const amt = parseFloat(document.getElementById('amount').value);
    
    if (amt <= 0) return;

    items.push({
        type: document.getElementById('type').value,
        description: document.getElementById('description').value,
        amount: amt,
        category: document.getElementById('category').value,
        date: document.getElementById('date').value
    });

    alert('Transaction added successfully!');

    e.target.reset();
    document.getElementById('date').valueAsDate = new Date();
    renderUI();
});

document.getElementById('clear-btn').addEventListener('click', () => {
    document.getElementById('expense-form').reset();
    document.getElementById('date').valueAsDate = new Date();
});

document.getElementById('filter').addEventListener('change', renderUI);
document.getElementById('search').addEventListener('input', renderUI);

function deleteItem(index) {
    items.splice(index, 1);
    renderUI();
}

renderUI();