// Product Database
const products = [
    {
        id: 1,
        name: "MacBook Pro 16\" M3",
        category: "Laptops",
        price: 2499,
        description: "Powerful laptop with M3 chip, 16GB RAM, perfect for professionals",
        icon: "💻"
    },
    {
        id: 2,
        name: "iPhone 15 Pro Max",
        category: "Smartphones",
        price: 1199,
        description: "Latest flagship with A17 Pro chip and titanium design",
        icon: "📱"
    },
    {
        id: 3,
        name: "Sony WH-1000XM5",
        category: "Audio",
        price: 399,
        description: "Industry-leading noise cancellation and premium sound quality",
        icon: "🎧"
    },
    {
        id: 4,
        name: "iPad Pro 12.9\"",
        category: "Tablets",
        price: 1099,
        description: "M2 chip with Liquid Retina XDR display for creators",
        icon: "📱"
    },
    {
        id: 5,
        name: "Dell XPS 15",
        category: "Laptops",
        price: 1899,
        description: "Ultra-slim design with powerful Intel i9 processor",
        icon: "💻"
    },
    {
        id: 6,
        name: "Samsung Galaxy S24 Ultra",
        category: "Smartphones",
        price: 1299,
        description: "Premium Android with S Pen and 200MP camera",
        icon: "📱"
    },
    {
        id: 7,
        name: "AirPods Pro 2",
        category: "Audio",
        price: 249,
        description: "Active noise cancellation with adaptive transparency",
        icon: "🎧"
    },
    {
        id: 8,
        name: "Apple Watch Ultra 2",
        category: "Wearables",
        price: 799,
        description: "Rugged smartwatch with precision GPS and dive computer",
        icon: "⌚"
    },
    {
        id: 9,
        name: "Microsoft Surface Pro 9",
        category: "Tablets",
        price: 1299,
        description: "Versatile 2-in-1 with Intel Core i7 for productivity",
        icon: "📱"
    },
    {
        id: 10,
        name: "Bose QuietComfort Ultra",
        category: "Audio",
        price: 429,
        description: "Premium headphones with spatial audio and comfort design",
        icon: "🎧"
    },
    {
        id: 11,
        name: "Google Pixel 8 Pro",
        category: "Smartphones",
        price: 999,
        description: "AI-powered camera and pure Android experience",
        icon: "📱"
    },
    {
        id: 12,
        name: "Lenovo ThinkPad X1 Carbon",
        category: "Laptops",
        price: 1799,
        description: "Business laptop with enterprise security and durability",
        icon: "💻"
    }
];

// Render products on products page
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">${product.icon}</div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price.toLocaleString()}</div>
                <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Add to cart function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Added to cart!');
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Initialize products page
if (document.getElementById('productsGrid')) {
    renderProducts();
}
