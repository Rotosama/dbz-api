const URL = "https://dragonball-api.com/api/";
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", searchCharacter);

let currentPage = 1;
let totalPages = 1;
let links = {};
let meta = {};
let races = [];
let gender = [];
let afiliations = [];

fetchAllCharacters();
createFilters();

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
		});

		updatePaginationButtons();
	} catch (error) {
		console.error("Error fetching characters:", error);
	} finally {
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
	card.addEventListener("click", () => showInfo(character.id));
	return card;
}

function showTransformations(transformations) {
	const modalContent = document.getElementById("modal-character-info");
	modalContent.innerHTML = "<h2>Transformaciones</h2>";

	transformations.forEach((transformation) => {
		let card = createCharacterCard(transformation);
		modalContent.appendChild(card);
	});
}

async function showInfo(characterId) {
	try {
		const response = await fetch(
			`https://dragonball-api.com/api/characters/${characterId}`
		);
		const data = await response.json();
		console.log(data);

		// Populate modal with character info
		const modalContent = document.getElementById("modal-character-info");
		modalContent.innerHTML = `
            <h2 class="dbtext">${data.name}</h2>
            <p class="dbtext">${data.affiliation}</p>
            <p>Planeta <span class="planet-text">${data.originPlanet.name}<span></p>
			<img src="${data.originPlanet.image}" alt="${data.name}">

			<p>${data.description}</p>
        `;
		if (data.transformations && data.transformations.length > 0) {
			const transformationsButton = document.createElement("button");
			transformationsButton.textContent = "Transformaciones";
			transformationsButton.onclick = () =>
				showTransformations(data.transformations);
			modalContent.appendChild(transformationsButton);
		}

		// Show the modal
		const modal = document.getElementById("character-modal");
		modal.style.display = "flex";

		// Close the modal when the user clicks on <span> (x)
		const closeButton = document.querySelector(".close-button");
		closeButton.onclick = function () {
			modal.style.display = "none";
		};

		// Close the modal when the user clicks anywhere outside of the modal
		window.onclick = function (event) {
			if (event.target == modal) {
				modal.style.display = "none";
			}
		};
	} catch (error) {
		console.error("Error fetching character info:", error);
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

	if (links.previous) {
		prevButton.disabled = false;
	} else {
		prevButton.disabled = true;
	}

	if (links.next) {
		nextButton.disabled = false;
	} else {
		nextButton.disabled = true;
	}
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
async function createFilters() {
	const response = await fetch(`${URL}characters?limit=1000`);
	const data = await response.json();
	const characters = data.items;
	characters.forEach((char) => {
		if (char.race) {
			races.push(char.race);
		}
		if (char.affiliation) {
			afiliations.push(char.affiliation);
		}
		if (char.gender) {
			gender.push(char.gender);
		}
	});

	races = [...new Set(races)];
	afiliations = [...new Set(afiliations)];
	gender = [...new Set(gender)];

	console.log(races);
	console.log(afiliations);
	console.log(gender);

	const filters = document.getElementById("filters");
	const raceFilter = document.createElement("div");
	raceFilter.innerHTML = "<h3 class='dbtext'>Raza</h3>";
	races.forEach((race) => {
		console.log(race);
		let containerFilter = document.createElement("div");
		let filterName = document.createElement("input");
		filterName.type = "checkbox";
		filterName.name = `${race}`;
		filterName.id = `${race}`;
		let filterLabel = document.createElement("label");
		filterLabel.setAttribute("for", `${race}`);
		filterLabel.innerText = `${race}`;
		filterName.addEventListener("change", (e) => {
			if (e.target.checked) {
				applyFilters("race=" + race);
			} else fetchAllCharacters();

			console.log(e);
		});
		containerFilter.appendChild(filterName);
		containerFilter.appendChild(filterLabel);
		raceFilter.appendChild(containerFilter);

		filters.appendChild(raceFilter);
	});

	const affiliationFilter = document.createElement("div");
	affiliationFilter.innerHTML = "<h3 class='dbtext'>Afiliación</h3>";
	afiliations.forEach((afiliation) => {
		console.log(afiliation);
		let containerFilter = document.createElement("div");

		let filterName = document.createElement("input");
		filterName.type = "checkbox";
		filterName.name = `${afiliation}`;
		let filterLabel = document.createElement("label");
		filterLabel.setAttribute("for", `${afiliation}`);
		filterLabel.innerText = `${afiliation}`;
		filterName.addEventListener("change", (e) => {
			if (e.target.checked) {
				applyFilters("affiliation=" + afiliation);
			} else fetchAllCharacters();

			console.log(e);
		});
		containerFilter.appendChild(filterName);
		containerFilter.appendChild(filterLabel);
		affiliationFilter.appendChild(containerFilter);

		filters.appendChild(affiliationFilter);
	});

	const genderFilter = document.createElement("div");
	genderFilter.innerHTML = "<h3 class='dbtext'>Género</h3>";
	gender.forEach((gen) => {
		console.log(gen);
		let containerFilter = document.createElement("div");
		let filterName = document.createElement("input");
		filterName.type = "checkbox";
		filterName.name = `${gen}`;
		let filterLabel = document.createElement("label");
		filterLabel.setAttribute("for", `${gen}`);
		filterLabel.innerText = `${gen}`;
		filterName.addEventListener("change", (e) => {
			if (e.target.checked) {
				applyFilters("gender=" + gen);
			} else {
				fetchAllCharacters();
			}
			console.log(e);
		});
		containerFilter.appendChild(filterName);
		containerFilter.appendChild(filterLabel);
		genderFilter.appendChild(containerFilter);
	});
	filters.appendChild(genderFilter);
}

async function applyFilters(filter) {
	const query = `${URL}characters?${filter}`;
	const response = await fetch(query);
	const data = await response.json();
	const characterList = document.getElementById("character-list");
	characterList.innerHTML = "";
	data.forEach((char) => {
		let card = createCharacterCard(char);
		characterList.appendChild(card);
	});
}
