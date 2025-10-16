function onas2_initModal() {
    const onas2_btnCertif = document.getElementById('idCertificateBtn');
    const onas2_wrapper = document.getElementById('id_onas2_wrapper');
    const onas2_btnClose = document.getElementById('id_onas2_btnClose');
    const onas2_overlay = document.getElementById('id_onas2_modalOverlay');

    if (!onas2_btnCertif || !onas2_wrapper || !onas2_btnClose || !onas2_overlay) {
        console.warn('Niektorý element ešte neexistuje.');
        return;
    }

    function onas2_openModal() {
        onas2_wrapper.style.display = 'block';
        onas2_overlay.style.display = 'block';
    	document.addEventListener('keydown', onas2_handleEsc);
    }

    function onas2_closeModal() {
        onas2_wrapper.style.display = 'none';
        onas2_overlay.style.display = 'none';
    	document.removeEventListener('keydown', onas2_handleEsc);
    }

    function onas2_handleEsc(e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
            const isVisible = onas2_overlay.style.display === 'block';
            if (isVisible) {
                onas2_closeModal();
            }
        }
    }

    onas2_btnCertif.addEventListener('click', onas2_openModal);
    onas2_btnClose.addEventListener('click', onas2_closeModal);
    onas2_overlay.addEventListener('click', onas2_closeModal);
}
