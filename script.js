
"use strict";

/*
  GANTI NOMOR DI BAWAH DENGAN NOMOR WHATSAPP TOKO KAMU.
  Gunakan kode negara 62, tanpa tanda +, spasi, atau angka 0 di depan.
  Contoh: 6281234567890
*/
const WHATSAPP_NUMBER = "6281234567890";

const products = [
    {
        id: 1,
        name: "Matcha Latte",
        category: "matcha",
        label: "Best Seller",
        description: "Matcha lembut berpadu dengan susu creamy.",
        price: 18000,
        image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 2,
        name: "Strawberry Matcha",
        category: "fruit",
        label: "Favorite",
        description: "Manisnya strawberry bertemu matcha khas kami.",
        price: 22000,
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 3,
        name: "Chocolate Matcha",
        category: "choco",
        label: "Rich & Creamy",
        description: "Perpaduan cokelat dan matcha yang kaya rasa.",
        price: 22000,
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 4,
        name: "Matcha Cream",
        category: "matcha",
        label: "Creamy",
        description: "Matcha nikmat dengan tekstur creamy yang lembut.",
        price: 20000,
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 5,
        name: "Taro Milk",
        category: "choco",
        label: "Sweet Mood",
        description: "Susu taro dengan rasa manis dan aroma khas.",
        price: 18000,
        image: "https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 6,
        name: "Vanilla Milk",
        category: "choco",
        label: "Classic",
        description: "Susu vanilla lembut untuk teman santaimu.",
        price: 16000,
        image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=700&q=80"
    }
];

// Data keranjang disimpan selama halaman sedang digunakan.
const cart = {};

const productGrid = document.getElementById("productGrid");
const cartButton = document.getElementById("cartButton");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const closeCartButton = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");
const toast = document.getElementById("toast");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

let toastTimer;

// Format harga ke dalam rupiah.
function formatRupiah(amount) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(amount);
}

// Menampilkan pemberitahuan singkat.
function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2300);
}

// Menampilkan produk sesuai kategori.
function renderProducts(category = "all") {
    const filteredProducts = category === "all"
        ? products
        : products.filter(product => product.category === category);

    productGrid.innerHTML = filteredProducts.map(product => `
        <article class="product-card">
            <div class="product-image-wrap">
                <img
                    class="product-image"
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >
                <span class="product-label">${product.label}</span>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-bottom">
                    <span class="product-price">${formatRupiah(product.price)}</span>
                    <button
                        class="add-cart"
                        data-add="${product.id}"
                        aria-label="Tambah ${product.name} ke keranjang"
                        title="Tambah ke keranjang"
                    >+</button>
                </div>
            </div>
        </article>
    `).join("");
}

// Filter menu.
document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".filter-btn").forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");
        renderProducts(button.dataset.filter);
    });
});

// Tambah produk ke keranjang.
productGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");

    if (!button) return;

    const id = Number(button.dataset.add);
    const product = products.find(item => item.id === id);

    if (!product) return;

    if (!cart[id]) {
        cart[id] = { product, quantity: 0 };
    }

    cart[id].quantity += 1;

    renderCart();
    showToast(`${product.name} ditambahkan ke keranjang!`);
});

// Hitung jumlah seluruh produk.
function getCartCount() {
    return Object.values(cart).reduce(
        (total, item) => total + item.quantity,
        0
    );
}

// Hitung total harga seluruh produk.
function getCartTotal() {
    return Object.values(cart).reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
    );
}

// Menampilkan isi keranjang.
function renderCart() {
    const items = Object.values(cart);

    cartCount.textContent = getCartCount();
    cartTotal.textContent = formatRupiah(getCartTotal());

    checkoutButton.disabled = items.length === 0;

    if (items.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">Keranjangmu masih kosong 🍵</p>
        `;
        return;
    }

    cartItems.innerHTML = items.map(item => `
        <div class="cart-item">
            <div>
                <h4>${item.product.name}</h4>
                <div class="cart-item-price">
                    ${formatRupiah(item.product.price * item.quantity)}
                </div>
                <div class="quantity-controls">
                    <button
                        data-change="${item.product.id}"
                        data-delta="-1"
                        aria-label="Kurangi ${item.product.name}"
                    >−</button>
                    <span>${item.quantity}</span>
                    <button
                        data-change="${item.product.id}"
                        data-delta="1"
                        aria-label="Tambah ${item.product.name}"
                    >+</button>
                </div>
            </div>
            <button
                class="remove-item"
                data-remove="${item.product.id}"
                aria-label="Hapus ${item.product.name}"
            >Hapus</button>
        </div>
    `).join("");
}

// Mengubah jumlah produk atau menghapusnya.
cartItems.addEventListener("click", event => {
    const changeButton = event.target.closest("[data-change]");
    const removeButton = event.target.closest("[data-remove]");

    if (changeButton) {
        const id = Number(changeButton.dataset.change);
        const delta = Number(changeButton.dataset.delta);

        if (!cart[id]) return;

        cart[id].quantity += delta;

        if (cart[id].quantity <= 0) {
            delete cart[id];
        }

        renderCart();
        return;
    }

    if (removeButton) {
        const id = Number(removeButton.dataset.remove);

        if (cart[id]) {
            delete cart[id];
            renderCart();
            showToast("Produk dihapus dari keranjang.");
        }
    }
});

// Membuka dan menutup keranjang.
function openCart() {
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("open");
    cartDrawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("cart-open");
    closeCartButton.focus();
}

function closeCart() {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("open");
    cartDrawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("cart-open");
}

cartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeCart();
    }
});

// Membuat pesan WhatsApp dari isi keranjang.
function orderViaWhatsApp() {
    const items = Object.values(cart);

    if (items.length === 0) {
        showToast("Tambahkan minuman ke keranjang terlebih dahulu.");
        return;
    }

    if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
        showToast("Periksa pengaturan nomor WhatsApp di script.js.");
        return;
    }

    const orderLines = items.map((item, index) => {
        const subtotal = item.product.price * item.quantity;

        return `${index + 1}. ${item.product.name} x${item.quantity}`
            + ` = ${formatRupiah(subtotal)}`;
    });

    const message = [
        "Halo MatchaBoy! Saya ingin memesan:",
        "",
        ...orderLines,
        "",
        `Total: ${formatRupiah(getCartTotal())}`,
        "",
        "Mohon konfirmasi pesanan saya. Terima kasih!"
    ].join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank", "noopener,noreferrer");
}

checkoutButton.addEventListener("click", orderViaWhatsApp);

// Tombol WhatsApp pada bagian kontak dan footer.
function openWhatsAppContact(event) {
    event.preventDefault();

    if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
        showToast("Atur nomor WhatsApp toko di file script.js.");
        return;
    }

    const message = encodeURIComponent(
        "Halo MatchaBoy! Saya ingin bertanya tentang menu minuman."
    );

    window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`,
        "_blank",
        "noopener,noreferrer"
    );
}

document.getElementById("contactWhatsApp")
    .addEventListener("click", openWhatsAppContact);

document.getElementById("footerWhatsApp")
    .addEventListener("click", openWhatsAppContact);

// Navigasi untuk layar HP.
menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.textContent = isOpen ? "×" : "☰";
    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.textContent = "☰";
        menuToggle.setAttribute("aria-expanded", "false");
    });
});

// Tahun footer otomatis mengikuti tahun sekarang.
document.getElementById("currentYear").textContent =
    new Date().getFullYear();

// Tampilkan menu dan keranjang saat website dibuka.
renderProducts();
renderCart();
