// Sample products data (fallback)
let products = [
    { id: 1, name: 'Coffee', price: 3.50, stock: 100 },
    { id: 2, name: 'Tea', price: 2.50, stock: 80 },
    { id: 3, name: 'Sandwich', price: 5.00, stock: 50 },
    { id: 4, name: 'Cake', price: 4.00, stock: 30 },
    { id: 5, name: 'Water', price: 1.50, stock: 120 }
];

let cart = [];

function initSales() {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }
    renderProducts();
    renderCart();
}

function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <h3>${product.name}</h3>
            <p class="price">$${product.price.toFixed(2)}</p>
            <p>Stock: ${product.stock}</p>
        `;
        productCard.addEventListener('click', () => addToCart(product));
        productsGrid.appendChild(productCard);
    });
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    renderCart();
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <span>${item.name} x${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        cartItems.appendChild(itemElement);
        total += item.price * item.quantity;
    });

    cartTotal.textContent = `$${total.toFixed(2)}`;
    document.getElementById('checkout-btn').disabled = cart.length === 0;
}

function calculateTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function showTenderScreen() {
    const total = calculateTotal();

    const tenderHTML = `
        <div id="tender-screen" class="modal" style="display:block;">
            <div class="modal-content">
                <span class="close-tender">&times;</span>
                <h2>Process Payment</h2>
                <div class="tender-options">
                    <button class="tender-btn" data-type="cash">Cash</button>
                    <button class="tender-btn" data-type="card">Card</button>
                </div>
                <div id="cash-tender" class="tender-details" style="display:none;">
                    <div class="form-group">
                        <label>Amount Received</label>
                        <input type="number" id="amount-received" min="${total.toFixed(2)}" step="0.01" value="${total.toFixed(2)}">
                    </div>
                    <div class="change-display">
                        <p>Change Due: <span id="change-due">$0.00</span></p>
                    </div>
                    <button id="complete-cash-payment" class="checkout-btn">Complete Payment</button>
                </div>
                <div id="card-tender" class="tender-details" style="display:none;">
                    <p>Simulating card payment...</p>
                    <button id="complete-card-payment" class="checkout-btn">Complete Payment</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', tenderHTML);

    // Setup listeners
    document.querySelector('.close-tender').addEventListener('click', closeTenderScreen);

    document.querySelectorAll('.tender-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tender-details').forEach(d => d.style.display = 'none');
            document.getElementById(`${btn.dataset.type}-tender`).style.display = 'block';
        });
    });

    document.getElementById('amount-received').addEventListener('input', function () {
        const received = parseFloat(this.value) || 0;
        const change = Math.max(0, received - total);
        document.getElementById('change-due').textContent = `$${change.toFixed(2)}`;
    });

    document.getElementById('complete-cash-payment').addEventListener('click', () => completePayment('cash'));
    document.getElementById('complete-card-payment').addEventListener('click', () => completePayment('card'));
}

function closeTenderScreen() {
    const tenderScreen = document.getElementById('tender-screen');
    if (tenderScreen) {
        tenderScreen.remove();
    }
}

function completePayment(type) {
    const total = calculateTotal();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    let paymentDetails = {
        type: type,
        amount: total,
        date: new Date().toISOString()
    };

    if (type === 'cash') {
        const received = parseFloat(document.getElementById('amount-received').value) || 0;
        paymentDetails.amountReceived = received;
        paymentDetails.change = Math.max(0, received - total);
    }

    saveTransaction(paymentDetails, currentUser?.username || "unknown");
    closeTenderScreen();
    alert(`Payment Successful!\nTotal: $${total.toFixed(2)}\nMethod: ${type}`);
    cart = [];
    renderCart();
}

function saveTransaction(paymentDetails, username) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    const transaction = {
        id: transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1,
        items: [...cart],
        total: paymentDetails.amount,
        paymentType: paymentDetails.type,
        timestamp: new Date().toISOString(),
        user: username
    };

    if (paymentDetails.type === 'cash') {
        transaction.amountReceived = paymentDetails.amountReceived;
        transaction.changeGiven = paymentDetails.change;
    }

    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Single checkout listener
document.getElementById('checkout-btn').addEventListener('click', function () {
    if (cart.length === 0) {
        alert("Please add items to cart first.");
        return;
    }
    showTenderScreen();
});
