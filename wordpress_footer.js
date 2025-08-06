      // Načítanie kratkeho zoznamu pracovných ponúk pre stlpec "Kariera" vo Footer.
      async function Footer_fill_ponuky() {
        const ul_container = document.getElementById("id-ul-ponuky");
        fetch("https://www.enitech.sk/wp-json/wp/v2/posts?per_page=5")
          .then(res => res.json())
          .then(data => {
            const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));

            ul_container.innerHTML = ""; // Vyčisti "Načítavam..."
            sorted.forEach(post => {
              const li_element = document.createElement("li");
              li_element.innerHTML = `<a href="indexKariera.html#top">${post.title.rendered}</a>`;
              ul_container.appendChild(li_element);
            });
            ul_container.classList.remove("footer-hidden");
          })
          .catch(err => {
            document.getElementById("id-ul-ponuky").textContent = "Chyba pri načítaní ponúk.";
            console.error("Chyba pri načítaní ponúk:", err);
            ul_container.classList.remove("footer-hidden");
          });
      }
