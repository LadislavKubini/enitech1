async function kontakt2_leaflet_init_map_pobocky() {
	const pobocky = [
		{
			coords: [48.97083, 18.18861],
			title: "Dubnica nad Váhom",
			image: "media/EnitechDubnica.jpg",
			ulica: "Dukelská štvrť 1404/613",
			mesto: "SK-018 41 Dubnica nad Váhom",
			email: "office@enitech.sk",
			homepage: "",
			color: "blue",
			lang_code: "05043"
		},
		{
			coords: [47.75611, 18.12500],
			title: "Kancelária Komárno",
			image: "media/EnitechKomarno.jpeg",
			ulica: "Dunajské nábrežie 1152",
			mesto: "SK-945 01 Komárno",
			email: "office@enitech.sk",
			homepage: "",
			color: "blue",
			lang_code: "05044"
		},
		{
			coords: [49.06528, 18.91806],
			title: "Kancelária Martin",
			image: "media/EnitechMartin.jpeg",
			ulica: "Andreja Kmeťa 17",
			mesto: "SK-036 01 Martin",
			email: "office@enitech.sk",
			homepage: "",
			color: "blue",
			lang_code: "05045"
		},
		{
			coords: [48.53444, 21.07722],
			title: "Kancelária Buzica",
			image: "media/EnitechBuzica.jpeg",
			ulica: "Buzica 130",
			mesto: "SK-044 73 Buzica",
			email: "office@enitech.sk",
			homepage: "",
			color: "blue",
			lang_code: "05046"
		},
		{
			coords: [47.74417, 18.11139],
			title: "DCA Hungary Kft.",
			image: "media/DCAKomarom.jpg",
			ulica: "Laktanya köz 3/A 1",
			mesto: "H - 2900 Komárom",
			email: "office@dcahungary.hu",
			homepage: "www.dcahungary.hu",
			color: "green",
			lang_code: "05047"
		}
	];
//****************************************************************************** */	
	if (typeof L === "undefined") {
		// Leaflet sa nenačítal → vložíme neutrálnu kartičku
		const mapDiv = document.getElementById('id-kontakt2-map');
		mapDiv.innerHTML = `
        <div class="kontakt2-map-error">
            <div>
                <h2>Mapa nie je dostupná</h2>
                <p>Nepodarilo sa načítať knižnicu <strong>Leaflet</strong>.<br></p>
            </div>
        </div>`;
		return;
	}
	// } else {

		// const initialZoom = window.innerWidth > 1300 ? 8 : 7;
		const w = window.innerWidth;
		const initialZoom =
			w > 1600 ? 9 :
			w > 1200 ? 8 :
			w > 500  ? 7 :
						6;
		console.log(`window.innerWidth: "${w}", initialZoom: "${initialZoom}"`);
		const kontakt2_map = L.map('id-kontakt2-map', {
			zoomControl: true,
			dragging: false,        // mapa sa nedá posúvať pred klikom
			scrollWheelZoom: false  // scroll kolečkom nepohne mapou
		}).setView([48.7, 19.7], initialZoom);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap'
		}).addTo(kontakt2_map);

		const blueIcon = L.icon({
			iconUrl: 'media/marker-icon-blue.png',
			shadowUrl: "media/marker-shadow.png",
			iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
			shadowSize: [41, 41]
		});

		const greenIcon = L.icon({
			iconUrl: 'media/marker-icon-green.png',
			shadowUrl: "media/marker-shadow.png",
			iconSize: [25, 41],
			iconAnchor: [12, 41], 
			popupAnchor: [1, -34],
			shadowSize: [41, 41]
		});

		const orangeIcon = L.icon({
			// iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
			// shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
			iconUrl: 'media/marker-icon-orange.png',
			shadowUrl: "media/marker-shadow.png",
			iconSize: [25, 41],
			iconAnchor: [12, 41],
			popupAnchor: [1, -34],
			shadowSize: [41, 41]
		});
		// ------------------------------------------------

		kontakt2_map.on('click', function () {
			this.dragging.enable();
			this.scrollWheelZoom.enable();
			const btn = document.querySelector('.leaflet-control-toggle');
			if (btn) btn.style.display = "block";
		});

//*** Vlastný control pre prepínanie interaktivity *************************************** */
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

//******************************************************************************************* */		
		const grid = document.getElementById('kontakt2-grid');
		let selectedMarker = null;
		let markerRefs = [];

		function activateMarker(marker, index) {
			if (selectedMarker) {
				selectedMarker._icon.classList.remove('selected');
				document.querySelector('.kontakt2-cell.active')?.classList.remove('active');
				// vrátime pôvodnú farbu podľa typu
				const originalP = pobocky.find(p =>
					p.coords[0] === selectedMarker.getLatLng().lat &&
					p.coords[1] === selectedMarker.getLatLng().lng
				);
				if (originalP) {
					if (originalP.color === "green") {
						selectedMarker.setIcon(greenIcon);
					} else {
						selectedMarker.setIcon(blueIcon);
					}
				} else {
					selectedMarker.setIcon(greenIcon);
				}
			}
			document.querySelector('.kontakt2-cell.active')?.classList.remove('active');

			marker.setIcon(orangeIcon);
			selectedMarker = marker;

			const cell = document.querySelector(`.kontakt2-cell[data-index='${index}']`);
			if (cell) {
				cell.classList.add('active');
				cell.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
			}
		}

//*** markery **************************************************************************************** */
		// Presunutý zelený marker s čiarou
		let offsetMarker = null;
		let offsetLine = null;
		let offsetCoords_orig = null;
		const offsetKoef = -0.007; // cca 1 km optický posun

		const isMobile = window.matchMedia("(max-width: 768px)").matches;
		pobocky.forEach((p, index) => {
			const popupContent = isMobile
				? `<div><strong lang-code="${p.lang_code}">${p.title}</strong></div>`
				: `<div><strong lang-code="${p.lang_code}">${p.title}</strong><br>
              <img src="${p.image}" width="100%"><br>
              <a href="mailto:${p.email}" style="text-decoration: none; color: inherit;">${p.email}</a>
            </div>`;

			let coords = p.coords;
			// console.log("p.title: ", p.title);
			if (p.color === "green") {
				// console.log("p.title inside ", p.title);
				offsetCoords_orig = [p.coords[0], p.coords[1]];
			}

			const icon = p.color === "green" ? greenIcon : blueIcon;
			const marker = L.marker(coords, { icon }).addTo(kontakt2_map).bindPopup(popupContent);

			if (p.color === "green") {
				offsetMarker = marker;
			}

			marker.on('click', () => {
				marker.openPopup();
				activateMarker(marker, index);
				// console.log("marker.on click")
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

//*** dolny grid pobociek **************************************************************************** */			
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

			let homepageHTML = "";
			if (p.homepage && p.homepage.trim() !== "") {
				const url  = p.homepage;
				const url_href = p.homepage.startsWith("http") ? p.homepage : `https://${p.homepage}`;
				homepageHTML = `<br><strong><a href="${url_href}" target="_blank" style="text-decoration: none; color: blue;">${url}</a></strong>`;
			}

			cell.innerHTML = `
			<div>
				<strong lang-code="${p.lang_code}">${p.title}</strong><br>
				<img src="${p.image}" width="100%"><br>
				${p.ulica}<br>
				${p.mesto}<br>
				<a href="mailto:${p.email}" style="text-decoration: none;">
				${emailIcon}<strong>${p.email}</strong>
				</a>
				${homepageHTML}
			</div>
			`;

			cell.setAttribute('data-index', index);
			cell.addEventListener('click', () => {
				const currentZoom = kontakt2_map.getZoom();
				kontakt2_map.setView(p.coords, currentZoom);
				marker.fire('click');
			});
			grid.appendChild(cell);
		});

		function updateOffsetMarker() {
			const zoom = kontakt2_map.getZoom();
			// console.log("updateOffsetMarker() → zoom:", zoom);

			if (offsetMarker && offsetCoords_orig) {
				if (zoom >= 11) {
					// pri veľkom priblížení – vráť marker na reálnu pozíciu a skry čiaru
					offsetMarker.setLatLng([offsetCoords_orig[0], offsetCoords_orig[1]]);
					if (offsetLine) {
						kontakt2_map.removeLayer(offsetLine);
					}
				} else {
					// pri oddialení – posuň marker a zobraz čiaru
					const offset = offsetKoef * (2**(11 - zoom));

					const coords0 = [offsetCoords_orig[0], offsetCoords_orig[1]]
					const coords1 = [offsetCoords_orig[0] + offset, offsetCoords_orig[1] + (1.5*offset)]
					// console.log("zoom, offset:", zoom, offset);
					offsetMarker.setLatLng([coords1[0], coords1[1]]);
					if (offsetLine) {
						if (kontakt2_map.hasLayer(offsetLine)) {
							kontakt2_map.removeLayer(offsetLine);
						}
					}
					offsetLine = L.polyline([coords0, coords1], {
						color: "green",
						weight: 1.5,
						dashArray: "4,3",
						opacity: 0.8});
					offsetLine.addTo(kontakt2_map);
				}
			}

			if (zoom >= 9) {
				kontakt2_map.closePopup();
			}
		}

		kontakt2_map.on('zoomend', () => {
			updateOffsetMarker();
		});

		updateOffsetMarker();

		setTimeout(() => {
			kontakt2_map.invalidateSize();
		}, 300);

	// }
}
