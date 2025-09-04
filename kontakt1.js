function do_kontakt1_captcha(e) {
	let captchaRunning = false;

	const captcha = document.getElementById("id-kontakt1-captcha");
	const spinner = document.getElementById("id-kontakt1-spinner");
	const captchaContainer = document.getElementById("id-kontakt1-captcha-container");

	if (captcha.checked || captchaRunning) return;

	spinner.style.display = "inline-block";
	captchaRunning = true;

	setTimeout(() => {
		spinner.style.display = "none";
		captcha.checked = true;
		captchaRunning = false;
	}, 4000);
}

async function do_kontakt1_submit(e) {
	e.preventDefault();

	const form = document.getElementById("id-kontakt1-form");
	const overlayDialog = document.getElementById("id-kontakt1-overlay");
	const overlayDialog_p = document.getElementById("id-kontakt1-dialog-p");
	const formData = new FormData(form);

	try {
		const response = await fetch(form.action, {
			method: "POST",
			body: formData
		});

		if (!response.ok) throw new Error("Server správu neprijal");

		const htmlString = await response.text();;
		const tempDiv = document.createElement("div");
		tempDiv.innerHTML = htmlString;
		const plainText = tempDiv.textContent || tempDiv.innerText;
		console.log(plainText);

		overlayDialog_p.innerHTML = plainText;
		overlayDialog.style.display = "flex";
		form.reset();
	} catch (err) {
		overlayDialog_p.innerHTML = "Chyba pri odosielaní správy: " + err.message;
		overlayDialog.style.display = "flex";
	}
}

function kontakt1_closeDialog() {
	const overlay = document.getElementById("id-kontakt1-overlay");
	const form = document.getElementById("id-kontakt1-form");

	overlay.style.display = "none";
	form.reset();
}

async function kontakt1_addEventListeners() {
	const form = document.getElementById("id-kontakt1-form");
	const captchaContainer = document.getElementById("id-kontakt1-captcha-container");

	captchaContainer.addEventListener("click", do_kontakt1_captcha);
	form.addEventListener("submit", do_kontakt1_submit);
}
