// Sample users data with email addresses
const users = [
    { id: 1, username: 'admin', password: 'admin123', isAdmin: true, email: 'admin@epos.com' },
    { id: 2, username: 'cashier', password: 'cashier123', isAdmin: false, email: 'cashier@epos.com' }
];

// Login functionality
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Store user in localStorage (without password for security)
        const userToStore = {
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin,
            email: user.email
        };
        localStorage.setItem('currentUser', JSON.stringify(userToStore));
        
        // Redirect 
        if (user.isAdmin) {
            showScreen('admin-screen');
            initAdmin();
        } else {
            showScreen('sales-screen');
            initSales();
        }
    } else {
        document.getElementById('login-error').textContent = 'Invalid username or password';
    }
});

// Forgot password functionality
document.getElementById('forgot-password-link').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('forgot-password-modal').style.display = 'block';
});

document.querySelector('.close-modal').addEventListener('click', function() {
    document.getElementById('forgot-password-modal').style.display = 'none';
    document.getElementById('recovery-message').textContent = '';
    document.getElementById('recovery-email').value = '';
});

document.getElementById('recovery-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('recovery-email').value;
    const user = users.find(u => u.email === email);
    
    if (user) {
        document.getElementById('recovery-message').textContent = 
            `Password reset instructions sent to ${email}`;
        
        // Simulating sending email 
        setTimeout(() => {
            document.getElementById('forgot-password-modal').style.display = 'none';
            document.getElementById('recovery-message').textContent = '';
            document.getElementById('recovery-email').value = '';
        }, 2000);
    } else {
        document.getElementById('recovery-message').textContent = 
            'No account found with that email address';
    }
});