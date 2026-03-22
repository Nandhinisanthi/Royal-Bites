const menuData = {
    mains: [
        { id: 1, name: "Chicken Biriyani", price: 18.99, desc: "A royal blend of flavorful rice, marinated chicken, and authentic biryani spices", img: "r2.jpg" },
        { id: 2, name: "Naan and Panneer Butter Masala", price: 24.99, desc: "A perfect combo of soft naan and rich paneer butter masala.", img: "r3.jpg" },
    ],
    desserts: [
        { id: 4, name: "Chocolate Lava Cake", price: 8.99, desc: "Warm chocolate cake with molten center, served with vanilla ice cream.", img: "choco.jpg" },
        { id: 5, name: "Tiramisu", price: 7.99, desc: "Classic Italian coffee-flavored dessert with mascarpone cream.", img: "tira.jpg" },
        { id: 6, name: "Cheesecake", price: 6.99, desc: "New York style cheesecake with berry compote.", img: "cheese.jpg" },
    ],
    drinks: [
        { id: 8, name: "Mojito", price: 9.99, desc: "Classic mint, lime, and rum cocktail.", img: "blue.jpg" },
        { id: 9, name: "Fresh Lemonade", price: 4.99, desc: "House-made with fresh lemons and mint.", img: "lemonade.jpg" },
        { id: 10, name: "Iced Tea", price: 3.99, desc: "Refreshing peach iced tea.", img: "ice.jpg" }
    ]
};
let cart = JSON.parse(localStorage.getItem('gourmetCart')) || [];
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    renderMenu();
    updateCartCount();
    setupEventListeners();
    loadCartFromStorage();
});
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
}
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}
function renderMenu() {
    const menuGrid = document.querySelector('#mains');
    const mainsHtml = menuData.mains.map(item => createMenuItemHtml(item)).join('');
    menuGrid.innerHTML = mainsHtml;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.target.dataset.tab;
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const grid = document.querySelector('.menu-grid');
            const itemsHtml = menuData[tab].map(item => createMenuItemHtml(item)).join('');
            grid.innerHTML = itemsHtml;
            grid.id = tab;
        });
    });
}
function createMenuItemHtml(item) {
    return `
        <div class="menu-item" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" data-desc="${item.desc}">
            <img src="${item.img}" alt="${item.name}">
            <div class="item-info">
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <div class="price">$${item.price.toFixed(2)}</div>
                <button class="add-btn" onclick="addToCart(${item.id}, '${item.name}', ${item.price}, '${item.desc}', '${item.img}')">
                    <i class="fas fa-plus"></i> Add
                </button>
            </div>
        </div>
    `;
}
function addToCart(id, name, price, desc, img) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, desc, img, quantity: 1 });
    }
    saveCart();
    updateCartCount();
    updateOrderTotal();
    const btn = event.target.closest('.add-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Added!';
    btn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = 'linear-gradient(135deg, #d4a574, #c8956a)';
    }, 1500);
}
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
    updateCartCount();
    updateOrderTotal();
}
function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            renderCart();
            updateCartCount();
            updateOrderTotal();
        }
    }
}
function saveCart() {
    localStorage.setItem('gourmetCart', JSON.stringify(cart));
}
function loadCartFromStorage() {
    cart = JSON.parse(localStorage.getItem('gourmetCart')) || [];
    renderCart();
    updateCartCount();
    updateOrderTotal();
}
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}
function renderCart() {
    const cartItems = document.getElementById('cart-items');
    if (cart.length === 0) {
        cartItems.innerHTML = '<div style="padding: 2rem; text-align: center; color: #666;"><i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem;"></i><p>Your cart is empty</p></div>';
        return;
    }
    const cartHtml = cart.map(item => `
        <div class="cart-item">
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="quantity-controls">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                <span style="font-weight: 600; min-width: 20px;">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i> Remove
            </button>
        </div>
    `).join(''); 
    cartItems.innerHTML = cartHtml;
}
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.10;
    const total = subtotal + tax; 
    document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`; 
    return total;
}
function updateOrderTotal() {
    const total = updateCartSummary();
    document.getElementById('order-total').textContent = total.toFixed(2); 
    const placeOrderBtn = document.getElementById('place-order-btn');
    if (cart.length === 0) {
        placeOrderBtn.disabled = true;
        placeOrderBtn.textContent = 'Add items to order';
    } else {
        placeOrderBtn.disabled = false;
        placeOrderBtn.innerHTML = `Place Order - $${total.toFixed(2)}`;
    }
}
function openCart() {
    document.getElementById('cart-modal').style.display = 'block';
    renderCart();
    updateCartSummary();
}
function closeCart() {
    document.getElementById('cart-modal').style.display = 'none';
}
function closeSuccess() {
    document.getElementById('success-modal').style.display = 'none';
    cart = [];
    saveCart();
    updateCartCount();
    updateOrderTotal();
    renderCart();
}
function setupEventListeners() {
    document.getElementById('cart-count').addEventListener('click', (e) => {
        e.stopPropagation();
        openCart();
    });  
    document.querySelector('.nav-link[href="#cart"]').addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
    });
    window.addEventListener('click', (e) => {
        const cartModal = document.getElementById('cart-modal');
        const successModal = document.getElementById('success-modal');
        if (e.target === cartModal) {
            closeCart();
        }
        if (e.target === successModal) {
            closeSuccess();
        }
    });
    document.getElementById('order-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('customer-name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();
        if (!name || !phone || !address || cart.length === 0) {
            alert('Please fill all required fields and add items to cart.');
            return;
        }
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
            alert('Please enter a valid 10-digit phone number.');
            return;
        }
        document.getElementById('success-modal').style.display = 'block';
        const orderData = {
            items: cart,
            customer: {
                name,
                phone,
                email: document.getElementById('email').value,
                address,
                instructions: document.getElementById('instructions').value
            },
            payment: document.querySelector('input[name="payment"]:checked').value,
            total: updateCartSummary()
        };
        console.log('Order placed:', orderData);
        document.getElementById('order-form').reset();
    });
}
document.querySelectorAll('input[required], textarea[required]').forEach(field => {
    field.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            this.style.borderColor = '#dc3545';
        } else {
            this.style.borderColor = '#d4a574';
        }
    });
});
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;
    if (currentScroll > lastScroll && currentScroll > 100 && window.innerWidth < 768) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    lastScroll = currentScroll;
});
