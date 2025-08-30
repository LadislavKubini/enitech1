async function kontakt2_leaflet_init_map_pobocky() {
	const pobocky = [
		{
			coords: [48.97083, 18.18861],
			title: "Dubnica nad Váhom",
			image: "media/EnitechDubnica.jpg",
			ulica: "Dukelská štvrť 1404/613",
			mesto: "SK-018 41 Dubnica nad Váhom",
			email: "office@enitech.sk",
			lang_code: "05043"
		},
		{
			coords: [47.75611, 18.12500],
			title: "Kancelária Komárno",
			image: "media/EnitechKomarno.jpeg",
			ulica: "Dunajské nábrežie 1152",
			mesto: "SK-945 01 Komárno",
			email: "office@enitech.sk",
			lang_code: "05044"
		},
		{
			coords: [49.06528, 18.91806],
			title: "Kancelária Martin",
			image: "media/EnitechMartin.jpeg",
			ulica: "Andreja Kmeťa 17",
			mesto: "SK-036 01 Martin",
			email: "office@enitech.sk",
			lang_code: "05045"
		},
		{
			coords: [48.53444, 21.07722],
			title: "Kancelária Buzica",
			image: "media/EnitechBuzica.jpeg",
			ulica: "Buzica 130",
			mesto: "SK-044 73 Buzica",
			email: "office@enitech.sk",
			lang_code: "05046"
		}
	];
	if (typeof L === "undefined") {
		// Leaflet sa nenačítal → vložíme neutrálnu kartičku
		const mapDiv = document.getElementById('id-kontakt2-map');
		mapDiv.innerHTML = `
        <div class="kontakt2-map-error">
            <div>
                <h2>Mapa nie je dostupná</h2>
                <p>Nepodarilo sa načítať knižnicu <strong>Leaflet</strong>.<br>
                Skontrolujte pripojenie na internet alebo nastavenia siete.</p>
            </div>
        </div>
    `;
	} else {

		// const kontakt2_map = L.map('id-kontakt2-map').setView([48.7, 19.7], 7);
		const kontakt2_map = L.map('id-kontakt2-map', {
			zoomControl: true,
			dragging: false,        // mapa sa nedá posúvať pred klikom
			scrollWheelZoom: false  // scroll kolečkom nepohne mapou
		}).setView([48.7, 19.7], 7);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap'
		}).addTo(kontakt2_map);

		kontakt2_map.on('click', function () {
			this.dragging.enable();
			this.scrollWheelZoom.enable();
			const btn = document.querySelector('.leaflet-control-toggle');
			if (btn) btn.style.display = "block";
		});

		
		// Vlastný control pre prepínanie interaktivity
		const toggleControl = L.Control.extend({
			options: { position: 'topleft' },
			onAdd: function (map) {
				const container = L.DomUtil.create('div', 'leaflet-control-toggle');
				container.style.backgroundColor = 'white';
				container.style.padding = '4px';
				container.style.cursor = 'pointer';
				container.innerHTML = 'Deaktivovať mapu';
				container.style.display = "none";

				container.onclick = function () {
					map.dragging.disable();
					map.scrollWheelZoom.disable();
					container.style.display = "none";
				};

				// Zabránime zachytávaniu udalostí mapou
				L.DomEvent.disableClickPropagation(container);
				L.DomEvent.disableScrollPropagation(container);

				return container;
			}
		});
		// Pridanie controlu do mapy
		kontakt2_map.addControl(new toggleControl());

		const grid = document.getElementById('kontakt2-grid');
		let selectedMarker = null;
		let markerRefs = [];

		function activateMarker(marker, index) {
			// Zrušíme predchádzajúci výber
			if (selectedMarker) {
				selectedMarker._icon.classList.remove('selected');
				document.querySelector('.kontakt2-cell.active')?.classList.remove('active');
			}

			// Nastavíme nový výber
			marker._icon.classList.add('selected');
			selectedMarker = marker;

			const cell = document.querySelector(`.kontakt2-cell[data-index='${index}']`);
			if (cell) {
				cell.classList.add('active');
				cell.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
			}
		}

		const isMobile = window.matchMedia("(max-width: 768px)").matches;
		pobocky.forEach((p, index) => {
			const popupContent = isMobile
				? `<div><strong lang-code="${p.lang_code}">${p.title}</strong></div>`
				: `<div><strong lang-code="${p.lang_code}">${p.title}</strong><br>
              <img src="${p.image}" width="100%"><br>
              <a href="mailto:${p.email}" style="text-decoration: none; color: inherit;">${p.email}</a>
            </div>`;

			const marker = L.marker(p.coords).addTo(kontakt2_map).bindPopup(popupContent);

			marker.on('click', () => {
				marker.openPopup();
				activateMarker(marker, index)
			});
			marker.on('mouseover', () => {
				marker.openPopup();
			});
			marker.on('mouseout', () => {
				if (selectedMarker !== marker) {
					marker.closePopup();
				}
			});

			markerRefs.push(marker);
			const emailIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" 
            fill="currentColor" viewBox="0 0 16 16" style="vertical-align: middle; margin-right: 4px;">
          <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 
          2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm13.5-1H2.5l5.5 
          4.5L13.5 3zM1 5.5v6.1l4.5-3.5L1 5.5zm1.6 6.9H13.4L8 
          8.5l-5.4 3.9zm9.9-3.4L15 11.6V5.5l-2.5 3.5z"/>
        </svg>
        `;

			const cell = document.createElement('div');
			cell.className = 'kontakt2-cell';
			cell.innerHTML =
				`<div>
            <strong lang-code="${p.lang_code}">${p.title}</strong><br>
            <img src="${p.image}" width="100%"><br>
            ${p.ulica}<br>
            ${p.mesto}<br>
            <a href="mailto:${p.email}" style="text-decoration: none;">
              ${emailIcon}<strong>${p.email}</strong>
            </a>
          </div>`;
			cell.setAttribute('data-index', index);
			cell.addEventListener('click', () => {
				const currentZoom = kontakt2_map.getZoom();
				kontakt2_map.setView(p.coords, currentZoom);
				marker.fire('click');
			});
			grid.appendChild(cell);
		});
		setTimeout(() => {
			kontakt2_map.invalidateSize();
		}, 300);

		kontakt2_map.on('zoomend', () => {
			if (kontakt2_map.getZoom() >= 9) {
				kontakt2_map.closePopup();
			}
		});
	}
}
