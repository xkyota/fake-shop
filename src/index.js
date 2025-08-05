const productsList = document.querySelector(".product-list");
const date = document.querySelector(".date");
const loadMoreBtn = document.querySelector(".load-more");

//! Header Watch
function updateDateTime() {
	date.textContent = new Date().toLocaleString();
}
updateDateTime();
setInterval(updateDateTime, 1000);

//! Pagination

// Controls the group number
let page = 7;
// Controls the number of items in the group
let perPage = 6;

//! Fetching the product from server

function renderPosts(posts) {
	const markup = posts
		.map(({ title, price, description, brand, image, _id }) => {
			return ` 
			<li class="product-item">
                <img src="${image}" alt="${title}" />
                <h3>${brand}</h3>
                <p>$${price}</p>
				<span>${description.slice(0, 15)}...</span>
                <button class="add-to-cart" data-id="${_id}">Add to Cart</button>
            </li> `;
		})
		.join("");
	productsList.insertAdjacentHTML("beforeend", markup);
}

async function fetchPosts() {
	const params = new URLSearchParams({
		_limit: perPage,
		_page: page,
	});

	const response = await fetch(`http://localhost:3000/data?${params}`);
	if (!response.ok) {
		throw new Error("Failed to fetch posts");
	}
	return response.json();
}

async function loadAndRenderPosts() {
	try {
		const spinnerHTML = `
			<div class="spinner-border" role="status" id="spinner">
			</div>
		`;

		loadMoreBtn.style.display = 'none'; 

		// const LoadMoreHTML = `<button class="load-more">Load More</button>`;

		// if (loadMoreBtn) loadMoreBtn.remove();

		const productsSection = document.querySelector(".products");
		productsSection.insertAdjacentHTML("beforeend", spinnerHTML);

		const posts = await fetchPosts();

		setTimeout(() => {
			const spinner = document.getElementById("spinner");
			if (spinner) spinner.remove();
			renderPosts(posts);
			page += 1;

			loadMoreBtn.style.display = 'none'; 

			// productsSection.insertAdjacentHTML("beforeend", LoadMoreHTML);
		}, 1000);

	} catch (error) {
		console.error("Error fetching posts:", error);
	}
}

loadAndRenderPosts();

loadMoreBtn.addEventListener("click", async () => {
	loadMoreBtn.style.display = "none";
	await loadAndRenderPosts();
	loadMoreBtn.style.display = "inherit";
});

//! Cart settings
productsList.addEventListener("click", (event) => {
	if (event.target.classList.contains("add-to-cart")) {
		const productId = event.target.dataset.id;
		const productItem = event.target.closest(".product-item");
		const title = productItem.querySelector("h3").textContent;
		const price = parseFloat(
			productItem.querySelector("p").textContent.replace("$", "")
		);
		const image = productItem.querySelector("img").src;
		const description = productItem.querySelector("span").textContent;

		const product = {
			id: productId,
			title,
			price,
			image,
			description,
		};

		addToCart(product);
	}
});

function addToCart(product) {
	const cart = JSON.parse(localStorage.getItem("cart")) || [];
	cart.push(product);
	localStorage.setItem("cart", JSON.stringify(cart));
	alert(`${product.title} added to cart`);
}
