// Checkout page functionality

// Load order summary on checkout page
function loadCheckoutSummary() {
    const cart = getCart();
    const checkoutItems = document.getElementById('checkoutItems');
    const summaryTotals = document.getElementById('summaryTotals');
    
    if (!checkoutItems || !summaryTotals) return;
    
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    // Display items
    checkoutItems.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <div class="checkout-item-image">${item.icon}</div>
            <div class="checkout-item-info">
                <div class="checkout-item-name">${item.name}</div>
                <div class="checkout-item-quantity">Qty: ${item.quantity}</div>
            </div>
            <div class="checkout-item-price">$${(item.price * item.quantity).toLocaleString()}</div>
        </div>
    `).join('');
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const shipping = subtotal > 500 ? 0 : 20;
    const total = subtotal + tax + shipping;
    
    summaryTotals.innerHTML = `
        <div class="summary-row">
            <span>Subtotal</span>
            <span>$${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        </div>
        <div class="summary-row">
            <span>Tax (10%)</span>
            <span>$${tax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        </div>
        <div class="summary-row">
            <span>Shipping</span>
            <span>${shipping === 0 ? '<strong style="color: var(--secondary);">FREE</strong>' : '$' + shipping.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        </div>
        ${shipping === 0 ? '<div class="summary-row" style="color: var(--secondary); font-size: 0.9rem; border-top: none; padding-top: 0;"><span>🎉 Free shipping unlocked!</span></div>' : ''}
        <div class="summary-row total">
            <span>Total</span>
            <span>$${total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        </div>
    `;
}

// Format card number input
function formatCardNumber(input) {
    let value = input.value.replace(/\s+/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    input.value = formattedValue;
}

// Format expiry date
function formatExpiry(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    input.value = value;
}

// Validate card number (simple Luhn algorithm)
function validateCardNumber(cardNumber) {
    const digits = cardNumber.replace(/\s+/g, '');
    if (!/^\d{13,19}$/.test(digits)) return false;
    
    let sum = 0;
    let isEven = false;
    
    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits[i]);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return sum % 10 === 0;
}

// Validate expiry date
function validateExpiry(expiry) {
    const match = expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;
    
    const month = parseInt(match[1]);
    const year = parseInt('20' + match[2]);
    
    if (month < 1 || month > 12) return false;
    
    const now = new Date();
    const expiryDate = new Date(year, month - 1);
    
    return expiryDate > now;
}

// Handle checkout form submission
function handleCheckoutSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Get form values
    const email = formData.get('email');
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const cardNumber = formData.get('cardNumber');
    const expiry = formData.get('expiry');
    const cvv = formData.get('cvv');
    
    // Validate card details
    if (!validateCardNumber(cardNumber)) {
        alert('Invalid card number. Please check and try again.');
        document.getElementById('cardNumber').focus();
        return;
    }
    
    if (!validateExpiry(expiry)) {
        alert('Invalid or expired card. Please check the expiry date.');
        document.getElementById('expiry').focus();
        return;
    }
    
    if (!/^\d{3,4}$/.test(cvv)) {
        alert('Invalid CVV. Please enter 3 or 4 digits.');
        document.getElementById('cvv').focus();
        return;
    }
    
    // Show processing state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '⏳ Processing...';
    submitBtn.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        // Generate order ID
        const orderId = Math.floor(100000 + Math.random() * 900000);
        
        // Store order details
        const orderDetails = {
            orderId: orderId,
            email: email,
            name: `${firstName} ${lastName}`,
            date: new Date().toISOString(),
            items: getCart(),
            total: calculateTotal()
        };
        
        // Save to localStorage (in real app, send to server)
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(orderDetails);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Clear cart
        localStorage.removeItem('cart');
        updateCartCount();
        
        // Show success modal
        document.getElementById('orderId').textContent = orderId;
        document.getElementById('confirmEmail').textContent = email;
        document.getElementById('successModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Reset form
        form.reset();
    }, 2000);
}

// Calculate total
function calculateTotal() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const shipping = subtotal > 500 ? 0 : 20;
    return subtotal + tax + shipping;
}

// Initialize checkout page
document.addEventListener('DOMContentLoaded', function() {
    // Load order summary
    loadCheckoutSummary();
    
    // Add form submit handler
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }
    
    // Card number formatting
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            formatCardNumber(this);
        });
    }
    
    // Expiry date formatting
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function() {
            formatExpiry(this);
        });
    }
    
    // CVV validation
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
        });
    }
    
    // Payment method toggle
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    const cardDetails = document.getElementById('cardDetails');
    
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'card') {
                cardDetails.style.display = 'block';
                // Make card fields required
                document.getElementById('cardName').required = true;
                document.getElementById('cardNumber').required = true;
                document.getElementById('expiry').required = true;
                document.getElementById('cvv').required = true;
            } else {
                cardDetails.style.display = 'none';
                // Make card fields optional
                document.getElementById('cardName').required = false;
                document.getElementById('cardNumber').required = false;
                document.getElementById('expiry').required = false;
                document.getElementById('cvv').required = false;
            }
        });
    });
});
