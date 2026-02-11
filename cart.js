// Cart management functions

// Get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart count in navigation
function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cartCount');
    cartCountElements.forEach(element => {
        element.textContent = count;
        if (count > 0) {
            element.style.animation = 'pulse 0.3s ease';
            setTimeout(() => element.style.animation = '', 300);
        }
    });
}

// Render cart items
function renderCart() {
    const cartContent = document.getElementById('cartContent');
    if (!cartContent) return;

    const cart = getCart();
    
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h2>Your cart is empty</h2>
                <p>Add some awesome products to get started!</p>
                <a href="products.html" class="btn btn-primary" style="max-width: 300px; margin: 2rem auto; text-decoration: none;">Browse Products</a>
            </div>
        `;
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const shipping = subtotal > 500 ? 0 : 20;
    const total = subtotal + tax + shipping;

    cartContent.innerHTML = `
        <div class="cart-items">
            ${cart.map((item, index) => `
                <div class="cart-item" style="animation-delay: ${index * 0.1}s">
                    <div class="cart-item-image">${item.icon}</div>
                    <div class="cart-item-details">
                        <h3 class="cart-item-title">${item.name}</h3>
                        <div class="cart-item-price">$${item.price.toLocaleString()}</div>
                    </div>
                    <div class="cart-item-controls">
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="cart-summary">
            <h3>Order Summary</h3>
            <div class="summary-row">
                <span>Subtotal</span>
                <span class="amount">$${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div class="summary-row">
                <span>Tax (10%)</span>
                <span class="amount">$${tax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <div class="summary-row">
                <span>Shipping</span>
                <span class="amount">${shipping === 0 ? 'FREE' : '$' + shipping.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            ${shipping === 0 ? '<div class="summary-row" style="color: var(--secondary); font-size: 0.9rem;"><span>🎉 Free shipping unlocked!</span></div>' : ''}
            <div class="summary-row total">
                <span>Total</span>
                <span class="amount">$${total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
            <button class="btn btn-primary" onclick="window.location.href='checkout.html'">Proceed to Checkout</button>
        </div>
    `;
}

// Update item quantity
function updateQuantity(productId, change) {
    let cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart(cart);
            updateCartCount();
            renderCart();
        }
    }
}

// Remove item from cart
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    updateCartCount();
    renderCart();
    
    if (typeof showNotification === 'function') {
        showNotification('Item removed from cart');
    }
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // If on cart page, render cart
    if (document.getElementById('cartContent')) {
        renderCart();
    }
});

// Pulse animation for cart count
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
`;
document.head.appendChild(style);
