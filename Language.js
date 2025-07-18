let lang = localStorage.getItem("lang") || "sk";  // načíta jazyk alebo nastaví default 'sk'
let translations = {};

/* Prepinanie jazykov  SK / DE / EN */
  function setLang(newLang) {
    lang = newLang;
    localStorage.setItem("lang", newLang);  // <-- uloží jazyk do localStorage
    UpdateTexts();
  }
    ///////////////////////////////////////////////
    function processLine(line) {
      const parts = line.split('||').map(p => p.trim());
      if (parts.length >= 4) {
        const [code, sk, de, en] = parts;
        translations[code] = { sk, de, en };
      }
    }
  
    async function LoadTranslations(filename) {
      return fetch(filename)
        .then(res => res.text())
        .then(data => {
          console.log("LoadTranslations: ", filename, " lang: ", lang);
          const lines = data.split('\n');
          let buffer = '';
          const codeRegex = /^\d{5}\s*\|\|/;

          lines.forEach((line, idx) => {
            const trimmed = line.trim();
            if (!trimmed) return;                 // preskoč prázdne riadky
            if (trimmed.startsWith("//")) return; // preskoč komentár

            if (codeRegex.test(trimmed)) {
              if (buffer) processLine(buffer);
              buffer = trimmed;
            } else {
              buffer += ' ' + trimmed; // pokračovanie riadku
            }
          });

          if (buffer) processLine(buffer); // spracuj posledný
        });
    }

    //////////////////////////////////////////////////
    function getTranslation(code, defaultText = '') {
      if (translations[code]) {
        return translations[code][lang] || defaultText;
      }
      return defaultText;
    }

    async function UpdateTexts() {
      // console.log("UpdateTexts");
      document.querySelectorAll('[lang-code]').forEach(el => {
        const code = el.getAttribute('lang-code');
        let defaultHTML = el.innerHTML;
        el.innerHTML = getTranslation(code, defaultHTML);
      });
    }
    // Priklad pouzitia:
    //  <script>
    //    (async () => { // zabalene do anonymnej async () => {} funkcie, aby bolo mozne volat "await"
    //      await LoadTranslations('translations.txt').then(() => {
    //        await UpdateTexts(); // vela zmien skrze el.innerText = "...";
    //      });
    //    })();
    //  </script>
