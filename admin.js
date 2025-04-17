function initAdmin() {
    // Load products from localStorage if available
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }
    
    renderAdminProducts();
    
    // Set up tab switching
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update active content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Set up add product button
    document.getElementById('add-product-btn').addEventListener('click', function() {
        const name = prompt('Enter product name:');
        if (!name) return;
        
        const price = parseFloat(prompt('Enter product price:'));
        if (isNaN(price)) return;
        
        const stock = parseInt(prompt('Enter stock quantity:'));
        if (isNaN(stock)) return;
        
        const newProduct = {
            id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
            name,
            price,
            stock
        };
        
        products.push(newProduct);
        saveProducts();
        renderAdminProducts();
    });
}

function renderAdminProducts() {
    const productList = document.getElementById('admin-product-list');
    productList.innerHTML = '';
    
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.innerHTML = `
            <div>
                <h3>${product.name}</h3>
                <p>Price: $${product.price.toFixed(2)} | Stock: ${product.stock}</p>
            </div>
            <div>
                <button class="edit-btn" data-id="${product.id}">Edit</button>
                <button class="delete-btn" data-id="${product.id}">Delete</button>
            </div>
        `;
        
        productItem.querySelector('.edit-btn').addEventListener('click', () => editProduct(product.id));
        productItem.querySelector('.delete-btn').addEventListener('click', () => deleteProduct(product.id));
        
        productList.appendChild(productItem);
    });
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const newName = prompt('Edit product name:', product.name);
    if (newName === null) return;
    
    const newPrice = parseFloat(prompt('Edit product price:', product.price));
    if (isNaN(newPrice)) return;
    
    const newStock = parseInt(prompt('Edit stock quantity:', product.stock));
    if (isNaN(newStock)) return;
    
    product.name = newName;
    product.price = newPrice;
    product.stock = newStock;
    
    saveProducts();
    renderAdminProducts();
}

function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    products = products.filter(p => p.id !== id);
    saveProducts();
    renderAdminProducts();
}

function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

function renderSalesReports() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const reportsTab = document.getElementById('reports-tab');
    
    // Clear previous content
    reportsTab.innerHTML = '<h2>Sales Reports</h2>';
    
    if (transactions.length === 0) {
        reportsTab.innerHTML += '<p>No transactions found</p>';
        return;
    }
    
    // Summary statistics
    const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
    const cashSales = transactions.filter(t => t.paymentType === 'cash').reduce((sum, t) => sum + t.total, 0);
    const cardSales = transactions.filter(t => t.paymentType === 'card').reduce((sum, t) => sum + t.total, 0);
    
    reportsTab.innerHTML += `
        <div class="report-summary">
            <div class="summary-card">
                <h3>Total Sales</h3>
                <p>$${totalSales.toFixed(2)}</p>
            </div>
            <div class="summary-card">
                <h3>Cash Sales</h3>
                <p>$${cashSales.toFixed(2)}</p>
            </div>
            <div class="summary-card">
                <h3>Card Sales</h3>
                <p>$${cardSales.toFixed(2)}</p>
            </div>
            <div class="summary-card">
                <h3>Total Transactions</h3>
                <p>${transactions.length}</p>
            </div>
        </div>
        <div class="transactions-table-container">
            <h3>Recent Transactions</h3>
            <table class="transactions-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>User</th>
                    </tr>
                </thead>
                <tbody id="transactions-body">
                    ${transactions.slice(0, 10).map(t => `
                        <tr>
                            <td>${t.id}</td>
                            <td>${new Date(t.timestamp).toLocaleString()}</td>
                            <td>${t.items.length} items</td>
                            <td>$${t.total.toFixed(2)}</td>
                            <td>${t.paymentType}${t.paymentType === 'cash' ? ` (Change: $${t.changeGiven.toFixed(2)})` : ''}</td>
                            <td>${t.user}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Update the tab switching to include reports rendering
document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        
        // Update active tab
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Update active content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabId}-tab`).classList.add('active');
        
        // If reports tab, render reports
        if (tabId === 'reports') {
            renderSalesReports();
        }
    });
});

function renderSalesReports() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const reportsTab = document.getElementById('reports-tab');
    
    // Clear previous content
    reportsTab.innerHTML = '<h2>Sales Reports</h2>';
    
    if (transactions.length === 0) {
        reportsTab.innerHTML += '<p>No transactions found</p>';
        return;
    }
    
    // Summary statistics
    const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
    const cashSales = transactions.filter(t => t.paymentType === 'cash').reduce((sum, t) => sum + t.total, 0);
    const cardSales = transactions.filter(t => t.paymentType === 'card').reduce((sum, t) => sum + t.total, 0);
    
    reportsTab.innerHTML += `
        <div class="report-summary">
            <div class="summary-card">
                <h3>Total Sales</h3>
                <p>$${totalSales.toFixed(2)}</p>
            </div>
            <div class="summary-card">
                <h3>Cash Sales</h3>
                <p>$${cashSales.toFixed(2)}</p>
            </div>
            <div class="summary-card">
                <h3>Card Sales</h3>
                <p>$${cardSales.toFixed(2)}</p>
            </div>
            <div class="summary-card">
                <h3>Total Transactions</h3>
                <p>${transactions.length}</p>
            </div>
        </div>
        <div class="transactions-table-container">
            <h3>Recent Transactions</h3>
            <table class="transactions-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>User</th>
                    </tr>
                </thead>
                <tbody id="transactions-body">
                    ${transactions.slice().reverse().slice(0, 10).map(t => `
                        <tr>
                            <td>${t.id}</td>
                            <td>${new Date(t.timestamp).toLocaleString()}</td>
                            <td>${t.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</td>
                            <td>$${t.total.toFixed(2)}</td>
                            <td>${t.paymentType}${t.paymentType === 'cash' ? ` (Change: $${t.changeGiven.toFixed(2)})` : ''}</td>
                            <td>${t.user}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Update the tab switching to include reports rendering
document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        
        // Update active tab
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Update active content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const activeTab = document.getElementById(`${tabId}-tab`);
        activeTab.classList.add('active');
        
        // If reports tab, render reports
        if (tabId === 'reports') {
            renderSalesReports();
        }
    });
});