// const bar = document.getElementById('bar');
// const nav = document.getElementById('navbar');
// const close = document.getElementById('close')

// if (bar) {
//     bar.addEventListener('click', () => {
//         nav.classList.add('active');
//     });
// }

// if (close) {
//     close.addEventListener('click', () => {
//         nav.classList.remove('active');
//     });
// }






// ================================
// MOBILE MENU
// ================================
const bar = document.getElementById("bar");
const nav = document.getElementById("navbar");
const close = document.getElementById("close");

if (bar) {
    bar.addEventListener("click", () => {
        nav.classList.add("active");
    });
}

if (close) {
    close.addEventListener("click", () => {
        nav.classList.remove("active");
    });
}

// ================================
// STORAGE
// ================================
const STORAGE_CART = "cara_cart";

// ================================
// CART FUNCTIONS
// ================================
function getCart() {
    return JSON.parse(localStorage.getItem(STORAGE_CART)) || [];
}

function saveCart(cart) {
    localStorage.setItem(STORAGE_CART, JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();

    let total = 0;

    cart.forEach(item => {
        total += item.qty;
    });

    const bag = document.querySelector("#lg-bag a");

    if (bag) {
        bag.title = `${total} item(s) in cart`;
    }
}

// ================================
// ADD TO CART
// ================================
document.addEventListener("DOMContentLoaded", () => {

    console.log("Script Loaded Successfully");

    const cartButtons = document.querySelectorAll(".cart");

    cartButtons.forEach(btn => {

        btn.addEventListener("click", function (e) {

            e.preventDefault();
            e.stopPropagation();

            const product = this.closest(".pro");

            if (!product) return;

            const name =
                product.querySelector("h5")?.innerText || "Product";

            const brand =
                product.querySelector("span")?.innerText || "";

            const priceText =
                product.querySelector("h4")?.innerText || "$0";

            const image =
                product.querySelector("img")?.src || "";

            const price = parseFloat(
                priceText.replace("$", "")
            );

            let cart = getCart();

            const existing = cart.find(item =>
                item.name === name &&
                item.price === price
            );

            if (existing) {
                existing.qty += 1;
            } else {
                cart.push({
                    id: Date.now(),
                    name,
                    brand,
                    price,
                    image,
                    qty: 1
                });
            }

            saveCart(cart);
            updateCartCount();

            alert(`${name} added to cart`);
        });

    });

    renderCartPage();
    couponSystem();
    contactValidation();
    newsletterSystem();
    updateCartCount();
});

// ================================
// CART PAGE
// ================================
function renderCartPage() {

    const tableBody = document.querySelector("#cart tbody");

    if (!tableBody) return;

    const cart = getCart();

    if (cart.length === 0) {

        tableBody.innerHTML = `
        <tr>
            <td colspan="6" style="text-align:center;">
                Your cart is empty
            </td>
        </tr>
        `;

        updateTotals(0);
        return;
    }

    tableBody.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {

        const subtotal = item.price * item.qty;

        total += subtotal;

        tableBody.innerHTML += `
        <tr>
            <td>
                <button onclick="removeItem(${index})">
                    X
                </button>
            </td>
            <td>
                <img src="${item.image}" width="70">
            </td>
            <td>${item.name}</td>
            <td>$${item.price}</td>
            <td>
                <input
                    type="number"
                    min="1"
                    value="${item.qty}"
                    onchange="updateQty(${index}, this.value)"
                >
            </td>
            <td>$${subtotal.toFixed(2)}</td>
        </tr>
        `;
    });

    updateTotals(total);
}

// ================================
// UPDATE QUANTITY
// ================================
function updateQty(index, qty) {

    let cart = getCart();

    cart[index].qty = Number(qty);

    saveCart(cart);

    renderCartPage();
}

// ================================
// REMOVE ITEM
// ================================
function removeItem(index) {

    let cart = getCart();

    cart.splice(index, 1);

    saveCart(cart);

    renderCartPage();

    updateCartCount();
}

// make global
window.removeItem = removeItem;
window.updateQty = updateQty;

// ================================
// TOTALS
// ================================
function updateTotals(total) {

    const subtotalTable =
        document.querySelector("#subtotal table");

    if (!subtotalTable) return;

    subtotalTable.innerHTML = `
        <tr>
            <td>Cart Subtotal</td>
            <td>$${total.toFixed(2)}</td>
        </tr>
        <tr>
            <td>Shipping</td>
            <td>Free</td>
        </tr>
        <tr>
            <td><strong>Total</strong></td>
            <td><strong>$${total.toFixed(2)}</strong></td>
        </tr>
    `;
}

// ================================
// COUPON SYSTEM
// ================================
function couponSystem() {

    const btn =
        document.querySelector("#coupon button");

    const input =
        document.querySelector("#coupon input");

    if (!btn || !input) return;

    btn.addEventListener("click", () => {

        const code =
            input.value.trim().toUpperCase();

        if (code === "SAVE20") {
            alert("20% Discount Coupon Applied");
        }
        else if (code === "WELCOME50") {
            alert("50% Discount Coupon Applied");
        }
        else {
            alert("Invalid Coupon");
        }
    });
}

// ================================
// CONTACT FORM
// ================================
function contactValidation() {

    const form =
        document.querySelector("#form-details form");

    if (!form) return;

    form.addEventListener("submit", (e) => {

        e.preventDefault();

        const inputs =
            form.querySelectorAll("input");

        let valid = true;

        inputs.forEach(input => {

            if (input.value.trim() === "") {
                valid = false;
            }
        });

        if (!valid) {
            alert("Please fill all fields");
            return;
        }

        alert("Message Sent Successfully");
        form.reset();
    });
}

// ================================
// NEWSLETTER
// ================================
function newsletterSystem() {

    const formBox =
        document.querySelector("#newletter .form");

    if (!formBox) return;

    const input =
        formBox.querySelector("input");

    const button =
        formBox.querySelector("button");

    if (!input || !button) return;

    button.addEventListener("click", () => {

        const email = input.value.trim();

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {

            alert("Enter valid email");

            return;
        }

        localStorage.setItem(
            "newsletterEmail",
            email
        );

        alert("Subscribed Successfully");

        input.value = "";
    });
}