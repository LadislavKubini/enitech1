      function toggleMenu() {
        const sideMenu = document.getElementById('sideMenu');
        const overlay = document.getElementById('overlay');
        const isOpen = sideMenu.classList.contains('open');
        if (isOpen) {
          closeMenu();
        } else {
          sideMenu.classList.add('open');
          overlay.classList.add('active');
        }
      }

      function closeMenu() {
        const sideMenu = document.getElementById('sideMenu');
        const overlay = document.getElementById('overlay');
        sideMenu.classList.remove('open');
        overlay.classList.remove('active');
      }

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          closeMenu();
        }
      });
