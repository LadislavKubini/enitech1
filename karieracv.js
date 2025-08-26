// globalne premenne pre upload files
const cv_maxFiles = 4;
const cv_maxSize = 8 * 1024 * 1024; // 8 MB
let cv_files = [];

function do_cv_captcha(e) {
	let captchaRunning = false;

	const captcha = document.getElementById("id-cv-captcha");
	const spinner = document.getElementById("id-cv-spinner");
	const captchaContainer = document.getElementById("id-cv-captcha-container");

	if (captcha.checked || captchaRunning) return;

	// captcha.disabled = true;
	spinner.style.display = "inline-block";
	captchaRunning = true;

	setTimeout(() => {
		spinner.style.display = "none";
		captcha.checked = true;
		// captcha.disabled = false;
		captchaRunning = false;
	}, 4000);
}

// submit ********************************************************************************************
function do_cv_submit(e) {
	e.preventDefault();
	const form = document.getElementById("id-cv-form");
	const meno = document.getElementById("id-cv-meno");
	const priezvisko = document.getElementById("id-cv-priezvisko");
	const telefon = document.getElementById("id-cv-telefon");
	const email = document.getElementById("id-cv-email");
	const sprava = document.getElementById("id-cv-sprava");
	const suhlas = document.getElementById("id-cv-suhlas");
	const catpcha = document.getElementById("id-cv-captcha");

	document.getElementById("id-cv-files-count").textContent = " " + cv_files.length;
	const overlayDialog = document.getElementById("id-cv-submit-dialog");
	overlayDialog.style.display = "flex"; // zobrazí dialóg
}

function do_cv_closeSubmitDialog() {
	const overlay = document.getElementById("id-cv-submit-dialog");
	overlay.style.display = "none";

	const form = document.getElementById("id-cv-form");
	form.reset(); // vymaže polia formulára
	cv_files = [];
	cv_updateAttachments();
}

// CV-files upload *********************************************************************************
function cv_chooseFile() {
	if (cv_files.length >= cv_maxFiles) {
		cv_showAlertDialog("max4");
		return;
	}
	document.getElementById('id-cv-fileInput').click();
}

function cv_fileInputChanged(event) {
	const file = event.target.files[0];
	if (!file) return;

	const totalSize = cv_files.reduce((acc, f) => acc + f.size, 0) + file.size;
	if (totalSize > cv_maxSize) {
		cv_showAlertDialog("max8MB");
		event.target.value = "";
		return;
	}

	cv_files.push(file);
	cv_updateAttachments();
	event.target.value = ""; // reset inputu
}

function cv_updateAttachments() {
	for (let i = 0; i < cv_maxFiles; i++) {
		const div = document.getElementById("id-cv-att-" + i);
		if (cv_files[i]) {
			div.style.display = "flex";
			const span = div.querySelector("span:not(.formular-remove-btn)");
			if (span) {
				console.log("cv_updateAttachments: " + cv_files[i].name);
				span.textContent = cv_files[i].name;
				span.setAttribute("title", cv_files[i].name);
			}
		} else {
			div.style.display = "none";
		}
	}
}

function cv_removeFile(index) {
	cv_files.splice(index, 1);
	cv_updateAttachments();
}

// Dialog nahradzujuci alert ***********************************************************
function cv_showAlertDialog(which) {
  document.querySelectorAll("#id-cv-alert-dialog p").forEach(p => p.style.display = "none");
  document.getElementById("id-cv-alert-text-" + which).style.display = "block";
  document.getElementById("id-cv-alert-dialog").style.display = "flex"; // alebo block
}

function cv_hideAlertDialog() {
  document.getElementById("id-cv-alert-dialog").style.display = "none";
}