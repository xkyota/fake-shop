const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

function loadCart() {
	const cart = JSON.parse(localStorage.getItem("cart")) || [];

	if (cart.length === 0) {
		cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
		return;
	}

	let total = 0;
	const markup = cart
		.map((item) => {
			total += item.price;
			return `
				<div class="cart-item">
					<img src="${item.image}" alt="${item.title}" width="80" />
					<div>
						<h4>${item.title}</h4>
						<p>${item.description}</p>
						<strong>$${item.price}</strong>
					</div>
				</div>
			`;
		})
		.join("");

	cartItemsContainer.innerHTML = markup;
	cartTotal.textContent = `$${total}`;
}

loadCart();

document.getElementById("checkout-btn").addEventListener("click", () => {
	alert("Thanks for your purchase!");
	localStorage.removeItem("cart");
	location.reload();
});
