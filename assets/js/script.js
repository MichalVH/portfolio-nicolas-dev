document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. GESTION DU MENU MOBILE (HAMBURGER)
    // ==========================================================================
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            const isExpanded = mobileMenu.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ==========================================================================
    // 2. ENVOI DU FORMULAIRE VIA WEB3FORMS (SANS RECHARGEMENT)
    // ==========================================================================
    const formContact = document.getElementById('form-contact');
    const statusMessage = document.getElementById('status-message');
    const btnSubmit = document.getElementById('btn-submit');

    if (formContact && statusMessage && btnSubmit) {
        formContact.addEventListener('submit', function (e) {
            e.preventDefault();

            btnSubmit.textContent = "Envoi en cours...";
            btnSubmit.disabled = true;
            statusMessage.textContent = "";
            statusMessage.className = "status-message";

            const formData = new FormData(formContact);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
                .then(async (response) => {
                    let res = await response.json();
                    if (response.status === 200) {
                        statusMessage.textContent = "Message envoyé avec succès ! Je vous recontacte sous 24h.";
                        statusMessage.classList.add('success');
                        formContact.reset();
                    } else {
                        statusMessage.textContent = "Erreur de configuration : " + res.message;
                        statusMessage.classList.add('error');
                    }
                })
                .catch(error => {
                    statusMessage.textContent = "Une erreur technique est survenue lors de l'envoi. Veuillez réessayer.";
                    statusMessage.classList.add('error');
                })
                .then(() => {
                    btnSubmit.textContent = "Envoyer la demande";
                    btnSubmit.disabled = false;
                });
        });
    }
});
