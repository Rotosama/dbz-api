const URL = "https://dragonball-api.com/api/";
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", searchCharacter);

let currentPage = 1;
let totalPages = 1;
let links = {};

fetchAllCharacters();

async function fetchAllCharacters(
	pageUrl = `${URL}characters?page=1&limit=10`
) {
	try {
		showLoadingSkeleton();
		const response = await fetch(pageUrl);
		const data = await response.json();
		console.log(data);
		const characters = data.items;
		totalPages = data.meta.totalPages;
		currentPage = data.meta.currentPage;
		links = data.links;
		console.log(links);

		const characterList = document.getElementById("character-list");
		characterList.innerHTML = "";

		characters.forEach((character) => {
			const card = createCharacterCard(character);
			characterList.appendChild(card);
			card.addEventListener("click", () =>
				showTransformations(character.id)
			);
		});

		updatePaginationButtons();
	} catch (error) {
		console.error("Error fetching characters:", error);
	} finally {
		hideLoadingSkeleton();
	}
}

function createCharacterCard(character) {
	const { name, image, ki } = character;
	const card = document.createElement("div");
	card.classList.add("character-card");
	const characterItem = document.createElement("div");
	characterItem.classList.add("character-item");

	const characterName = document.createElement("h2");
	characterName.classList.add("name");
	characterName.textContent = name;

	const characterImage = document.createElement("img");
	characterImage.src = image;
	characterImage.alt = name;

	const characterKi = document.createElement("p");
	characterKi.classList.add("ki");
	characterKi.textContent = `Ki: ${ki}`;

	characterItem.appendChild(characterImage);
	characterItem.appendChild(characterName);
	characterItem.appendChild(characterKi);

	card.appendChild(characterItem);
	return card;
}

async function showTransformations(characterId) {
	try {
		const response = await fetch(
			`https://dragonball-api.com/api/characters/${characterId}`
		);
		const data = await response.json();
		console.log(data);
	} catch (error) {
		console.error("Error fetching transformations:", error);
	}
}

async function searchCharacter() {
	const searchInputValue = document.getElementById("search-input").value;
	const characterList = document.getElementById("character-list");
	characterList.innerHTML = "";

	if (searchInputValue) {
		const prevButton = document.getElementById("prev-page");
		const nextButton = document.getElementById("next-page");
		prevButton.disabled = true;
		nextButton.disabled = true;
		const query = `https://dragonball-api.com/api/characters?name=${searchInputValue}`;
		const response = await fetch(query);
		const data = await response.json();
		const characters = data;

		characters.forEach((character) => {
			const card = createCharacterCard(character);
			characterList.appendChild(card);
			card.addEventListener("click", () =>
				showTransformations(character.id)
			);
		});
	} else {
		fetchAllCharacters();
	}
}

function updatePaginationButtons() {
	const prevButton = document.getElementById("prev-page");
	const nextButton = document.getElementById("next-page");

	prevButton.disabled = !links.previous;
	nextButton.disabled = !links.next;
}

function prevPage() {
	if (links.previous) {
		fetchAllCharacters(links.previous);
	}
	scrollTop();
}

function nextPage() {
	if (links.next) {
		fetchAllCharacters(links.next);
	}
	scrollTop();
}

function scrollTop() {
	window.scrollTo({ top: 0, behavior: "smooth" });
}

function showLoadingSkeleton() {
	const characterList = document.getElementById("character-list");
	characterList.innerHTML = "";

	for (let i = 0; i < 10; i++) {
		const skeletonCard = document.createElement("div");
		skeletonCard.classList.add("skeleton-card");

		const skeletonImage = document.createElement("div");
		skeletonImage.classList.add("skeleton-image");

		const skeletonText1 = document.createElement("div");
		skeletonText1.classList.add("skeleton-text");

		const skeletonText2 = document.createElement("div");
		skeletonText2.classList.add("skeleton-text");

		skeletonCard.appendChild(skeletonImage);
		skeletonCard.appendChild(skeletonText1);
		skeletonCard.appendChild(skeletonText2);

		characterList.appendChild(skeletonCard);
	}
}

function hideLoadingSkeleton() {
	const characterList = document.getElementsById("character-card");
	characterList.innerHTML = "";
}
