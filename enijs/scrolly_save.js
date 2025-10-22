    window.addEventListener("beforeunload", function () {
      const key = "scrollPos:" + location.pathname;
      sessionStorage.setItem(key, window.scrollY); // save actual scroll position (jedinecna position pre kazdy html subor)
    });

    // function restoreScrollYPosition() { // vola sa na konci scriptu po F5
    //     const key = "scrollPos:" + location.pathname;
    //     const scrollY = sessionStorage.getItem(key);
    //     if (scrollY !== null) {
    //         window.scrollTo(0, parseInt(scrollY, 10));
    //     }
    // }

    function restoreScrollYPosition() {
        // Moderný spôsob – zistí, či šlo o reload (F5)
        const entries = performance.getEntriesByType("navigation");
        const isReload = entries.length > 0 && entries[0].type === "reload";

        if (isReload) {
            const key = "scrollPos:" + location.pathname;
            const scrollY = sessionStorage.getItem(key);
            if (scrollY !== null) {
                window.scrollTo(0, parseInt(scrollY, 10));
            }
        } else {
            // Ak NEŠLO o reload, vymaž uloženú pozíciu (z iného odkazu sem nepreskakujeme!)
            const key = "scrollPos:" + location.pathname;
            sessionStorage.removeItem(key);
        }
    }
