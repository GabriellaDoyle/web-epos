document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        if (currentUser.isAdmin) {
            showScreen('admin-screen');
            initAdmin();
        } else {
            showScreen('sales-screen');
            initSales();
        }
    } else {
        showScreen('login-screen');
    }
    
    // Set up logout buttons
    document.getElementById('logout-btn').addEventListener('click', logout);
    document.getElementById('admin-logout-btn').addEventListener('click', logout);
});

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function logout() {
    localStorage.removeItem('currentUser');
    showScreen('login-screen');
}