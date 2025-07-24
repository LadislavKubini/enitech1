    function do_kontakt1_captcha(e) {
     let captchaRunning = false;

      const captcha = document.getElementById("id-kontakt1-captcha");
      const spinner = document.getElementById("id-kontakt1-spinner");
      const captchaContainer = document.getElementById("id-kontakt1-captcha-container");  

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

    function do_kontakt1_submit(e) {
      e.preventDefault();
      const form = document.getElementById("id-kontakt1-form");
      const meno = document.getElementById("id-kontakt1-meno");
      const priezvisko = document.getElementById("id-kontakt1-priezvisko");
      const telefon = document.getElementById("id-kontakt1-telefon");
      const email = document.getElementById("id-kontakt1-email");
      const sprava = document.getElementById("id-kontakt1-sprava");
      const overlayDialog = document.getElementById("id-kontakt1-overlay");

      overlayDialog.style.display = "flex"; // zobrazí dialóg
    }

    function kontakt1_closeDialog() {
      const overlay = document.getElementById("id-kontakt1-overlay");
      const form = document.getElementById("id-kontakt1-form");

      overlay.style.display = "none";
      form.reset(); // voliteľne vymaže polia formulára
    }

    async function kontakt1_addEventListeners() {
      const form = document.getElementById("id-kontakt1-form");
      const captchaContainer = document.getElementById("id-kontakt1-captcha-container");

      captchaContainer.addEventListener("click", do_kontakt1_captcha);
      form.addEventListener("submit", do_kontakt1_submit);
    }
