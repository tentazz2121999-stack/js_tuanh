let products = [];
let currentindex = 0;
let step = 4;
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Dùng DOMContentLoaded thay vì window.onload
document.addEventListener("DOMContentLoaded", function () {
    const productList = document.getElementById("product-list");
    
    if (!productList) {
        console.error("❌ Không tìm thấy #product-list!");
        return;
    }

    loadProducts();

    const sortSelect = document.getElementById("sortOrder");
    if (sortSelect) {
        sortSelect.addEventListener("change", sortProducts);
    }

    updateCartCount();
});

function loadProducts() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "products.json", true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            try {
                products = JSON.parse(this.responseText);
                showproducts();
            } catch (e) {
                console.error("Lỗi parse JSON:", e);
            }
        } else {
            console.error("Lỗi tải products.json - Status:", xhr.status);
        }
    };
    xhr.onerror = () => console.error("Lỗi kết nối khi tải products.json");
    xhr.send();
}

function showproducts() {
    let nextindex = currentindex + step;
    let list = products.slice(currentindex, nextindex);
    displayProducts(list);
    currentindex = nextindex;
}

function displayProducts(list) {
    const container = document.getElementById("product-list");
    if (!container) return;

    let html = "";
    list.forEach(product => {
        html += `
        <div class="col-md-3 mb-4">
            <div class="card h-100">
                <img src="${product.image || product.img}" class="card-img-top" alt="${product.name}" 
                    style="height: 200px; object-fit: contain;">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text mt-auto">${Number(product.price).toLocaleString('vi-VN')} VND</p>
                    <button class="btn btn-primary mt-2 add-to-cart" data-id="${product.id || product.name}">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>`;
    });

    container.innerHTML = html;
    attachAddToCartEvents();
}

function attachAddToCartEvents() {
    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", function () {
            addToCart(this.dataset.id);
        });
    });
}

function addToCart(productId) {
    const product = products.find(p => (p.id && p.id == productId) || p.name === productId);
    if (!product) return alert("Không tìm thấy sản phẩm!");

    const existing = cart.find(item => item.name === product.name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1, checked: false, img: product.image || product.img });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(product.name + " đã thêm vào giỏ hàng!");
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((a, b) => a + (b.qty || 1), 0);
    const badge = document.getElementById("cart-count");
    if (badge) badge.textContent = count;
}

function showmore() {
    const btn = document.getElementById("loadmore");
    const loading = document.getElementById("loading");

    if (btn) btn.disabled = true;
    if (loading) loading.innerHTML = "Đang tải thêm...";

    setTimeout(() => {
        let nextindex = currentindex + step;
        let moreProducts = products.slice(currentindex, nextindex);

        if (moreProducts.length === 0) {
            if (btn) btn.style.display = "none";
            if (loading) loading.innerHTML = "<p style='color: gray;'>Đã hiển thị hết sản phẩm</p>";
            return;
        }

        let currentHtml = document.getElementById("product-list").innerHTML;

        moreProducts.forEach(product => {
            currentHtml += `
            <div class="col-md-3 mb-4">
                <div class="card h-100">
                    <img src="${product.image || product.img}" class="card-img-top" alt="${product.name}" 
                        style="height: 200px; object-fit: contain;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text mt-auto">${Number(product.price).toLocaleString('vi-VN')} VND</p>
                        <button class="btn btn-primary mt-2 add-to-cart" data-id="${product.id || product.name}">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>`;
        });

        document.getElementById("product-list").innerHTML = currentHtml;
        currentindex = nextindex;

        attachAddToCartEvents();

        if (loading) loading.innerHTML = "";
        if (btn) btn.disabled = false;

        // Ẩn nút nếu hết sản phẩm
        if (currentindex >= products.length && btn) {
            btn.style.display = "none";
        }
    }, 600);
}

function sortProducts() {
    if (products.length === 0) return;

    let sortedProducts = [...products];

    if (this.value === "asc") {
        sortedProducts.sort((a, b) => Number(a.price) - Number(b.price));
    } else {
        sortedProducts.sort((a, b) => Number(b.price) - Number(a.price));
    }

    products = sortedProducts;

    let currentlyLoaded = currentindex;
    currentindex = 0;

    let toShow = products.slice(0, currentlyLoaded);
    displayProducts(toShow);

    currentindex = currentlyLoaded;

    const btn = document.getElementById("loadmore");
    if (currentindex >= products.length && btn) {
        btn.style.display = "none";
    }
}