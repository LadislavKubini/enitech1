// Importuje štýl, obsah a voliteľne skript – vracia Promise
async function ImportBlock(fileName, sourceStyleId, destStyleId, sourceDivId, destDivId, optionalScriptId = null) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(`Načítavam: ${fileName}`);
      const response = await fetch(fileName);

      if (!response.ok) {
        throw new Error(`HTTP chyba ${response.status}`);
      }

      const htmlText = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');

      // Import štýlov
      const sourceStyle = doc.getElementById(sourceStyleId);
      const destStyle = document.getElementById(destStyleId);
      if (sourceStyle && destStyle) {
        destStyle.innerHTML = sourceStyle.innerHTML;
        console.log(`Štýl z "${fileName}" bol importovaný.`);
      } else {
        console.warn(`Štýl nebol nájdený: ${sourceStyleId}`);
      }

      // Import HTML obsahu (div)
      const sourceDiv = doc.getElementById(sourceDivId);
      const destDiv = document.getElementById(destDivId);
      if (sourceDiv && destDiv) {
        destDiv.innerHTML = sourceDiv.innerHTML;
        console.log(`Obsah z "${fileName}" bol importovaný.`);
      } else {
        console.warn(`Obsah nebol nájdený: ${sourceDivId}`);
      }

      // Spustenie skriptu, ak bol zadaný
      if (optionalScriptId) {
        const scriptEl = doc.getElementById(optionalScriptId);
        if (scriptEl) {
          const code = scriptEl.textContent;

          const scriptTag = document.createElement("script");
          scriptTag.textContent = code;
          document.body.appendChild(scriptTag);

          console.log(`Skript "${optionalScriptId}" z "${fileName}" bol spustený.`);
        } else {
          console.warn(`Skript nebol nájdený: ${optionalScriptId}`);
        }
      }

      resolve(true); // Úspešné dokončenie
    } catch (error) {
      console.error(`Chyba pri načítaní "${fileName}":`, error);
      reject(error);
    }
  });
}

// Jednoduchšia verzia pre import len <div> obsahu
async function ImportDiv(fileName, sourceDivId, destDivId) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(`ImportDiv: načítavam ${sourceDivId} : ${fileName}`);
      const response = await fetch(fileName);

      if (!response.ok) {
        throw new Error(`HTTP chyba ${response.status}`);
      }

      const htmlText = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');

      const sourceDiv = doc.getElementById(sourceDivId);
      const destDiv = document.getElementById(destDivId);
      if (sourceDiv && destDiv) {
        destDiv.innerHTML = sourceDiv.innerHTML;
        console.log(`ImportDiv: Obsah ${sourceDivId} z ${fileName} bol importovaný.`);
      } else {
        console.warn(`ImportDiv: Obsah nebol nájdený: ${sourceDivId}`);
      }

      resolve(true);
    } catch (error) {
      console.error(`ImportDiv: Chyba pri načítaní "${fileName}":`, error);
      reject(error);
    }
  });
}
