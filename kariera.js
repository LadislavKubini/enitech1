const perPage = 10;
let currentPage = 1;
let totalPages = 0;

// Kategorie: 5 = IT, 4 = Engineering
const categories = {
	it: 5,
	eng: 4
};

let activeCategory = categories.it;

// Globálna premená pre ponuky
let dataPonuky = [];

// Pomocná funkcia: odstráni HTML značky z excerptu
function stripHTML(html) {
	return html.replace(/<[^>]*>?/gm, '').trim();
}

// Načítanie a spracovanie pracovných ponúk
async function openProjects_fetchPosts(page = 1) {
	console.log("fetchPosts");
	currentPage = page;
	const baseUrl = "https://www.enitech.sk/wp-json/wp/v2/posts";
	let query = `?per_page=${perPage}&page=${page}&categories=${activeCategory}`;
	const container = document.getElementById("id_listPonuky");
	container.innerText = "Wait please, downloading projects...";

	try {
		const res = await fetch(baseUrl + query);

		const total = res.headers.get("X-WP-Total");
		totalPages = Math.ceil(total / perPage);
		buildPagination();

		const data = await res.json();
		const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));

		dataPonuky = sorted;
		displayPosts(dataPonuky);

		const container = document.getElementById("id_kariera-ponuky");

	} catch (err) {
		document.getElementById("id_listPonuky").textContent = "Chyba pri načítaní ponúk.";
		console.error("Chyba:", err);
	}
}

function displayPosts(posts) {
	console.log("displayPosts start: ");
	const container = document.getElementById("id_listPonuky");
	container.innerHTML = "";

	if (!posts || posts.length === 0) {
		container.innerHTML = "<p>Žiadne pracovné ponuky neboli nájdené.</p>";
		return;
	}

	posts.forEach((post, index) => {
		const div1 = document.createElement("div");
		div1.className = "kariera-grid-item";
		const div2 = document.createElement("div");
		div2.className = "kariera-inner-grid";

		const div3L = document.createElement("div");
		div3L.className = "kariera-job-left";
		div3L.innerHTML = `
          <div class="date">${new Date(post.date).toLocaleDateString("sk-SK")}</div>
          <h2>${post.title.rendered}</h2>
          <p>${stripHTML(post.excerpt.rendered)}</p>
        `;

		const div3R = document.createElement("div");
		div3R.className = "kariera-job-right";
		const btnSeeMore = document.createElement("button");
		btnSeeMore.className = "kariera-see-more";
		btnSeeMore.setAttribute("lang-code", "08015");
		btnSeeMore.innerText = ".See more"
		btnSeeMore.onclick = () => showDetail(index);

		div3R.appendChild(btnSeeMore);
		div2.appendChild(div3L);
		div2.appendChild(div3R);
		div1.appendChild(div2);
		container.appendChild(div1);
	});
	UpdateTexts();
}

function buildPagination() {
	const pagination = document.getElementById("id_pagination");
	pagination.innerHTML = "";

	for (let i = 1; i <= totalPages; i++) {
		const btn = document.createElement("button");
		btn.textContent = i;
		if (i === currentPage) btn.disabled = true;
		btn.onclick = () => openProjects_fetchPosts(i);
		pagination.appendChild(btn);
	}

	if (currentPage < totalPages) {
		const nextBtn = document.createElement("button");
		nextBtn.textContent = ".Ďalšie";
		nextBtn.setAttribute("lang-code", "08016");
		nextBtn.onclick = () => openProjects_fetchPosts(currentPage + 1);
		pagination.appendChild(nextBtn);
	}
}

function setCategory(cat) {
	activeCategory = categories[cat];
	currentPage = 1;
	updateCategoryButtons(cat);
	openProjects_fetchPosts();
}

function updateCategoryButtons(active) {
	const btnIt = document.getElementById("id_btn-it");
	const btnEng = document.getElementById("id_btn-eng");

	if (active === "it") {
		btnIt.className = "kariera-button active";
		btnEng.className = "kariera-button inactive";
	} else {
		btnIt.className = "kariera-button inactive";
		btnEng.className = "kariera-button active";
	}
}

function showDetail(index) {
	const post = dataPonuky[index];
	const div = document.getElementById("id_detailPonuka");
	div.innerHTML = `
        <h2>${post.title.rendered}</h2>
        <div class="datum">${new Date(post.date).toLocaleDateString("sk-SK")}</div>
        <div>${post.content.rendered}</div>
        <div style="margin-top:20px; text-align: right;">
          <button class="kariera-see-more" onclick="showList()">Späť na zoznam ponúk</button>
        </div>
      `;

	// Prepnutie viditeľnosti
	document.getElementById("id_karieraNadpis").style.display = "none";
	document.getElementById("id_kariera-buttons").style.display = "none";
	document.getElementById("id_listPonuky").style.display = "none";
	document.getElementById("id_pagination").style.display = "none";
	document.getElementById("id-detailBlock").style.display = "flex";
	document.getElementById("id_PonukyFooter").style.display = "none";

	document.getElementById("id_detailPonuka").scrollIntoView({ behavior: "smooth" });
}

function showList() {
	document.getElementById("id_karieraNadpis").style.display = "block";
	document.getElementById("id_kariera-buttons").style.display = "block";
	document.getElementById("id-detailBlock").style.display = "none";
	document.getElementById("id_listPonuky").style.display = "block";
	document.getElementById("id_pagination").style.display = "block";
	document.getElementById("id_PonukyFooter").style.display = "block";
}

// Eventy
// Spustí sa až po načítaní obsahu
function kariera_registerButtons() {
	const btnIT = document.getElementById("id_btn-it");
	const btnEng = document.getElementById("id_btn-eng");

	if (btnIT && btnEng) {
		btnIT.addEventListener("click", () => setCategory("it"));
		btnEng.addEventListener("click", () => setCategory("eng"));
	} else {
		console.error("Tlačidlá sa nenašli v DOMe (kariera.js)");
	}
}

