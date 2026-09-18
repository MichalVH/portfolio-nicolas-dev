document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. GESTION DU MENU MOBILE (HAMBURGER)
    // ==========================================================================
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            // Ajoute ou retire la classe active pour afficher/masquer le menu
            mobileMenu.classList.toggle('active');
            
            // Accessibilité : mise à jour de l'état du bouton pour les liseuses
            const isExpanded = mobileMenu.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Fermeture automatique du menu quand on clique sur un lien (navigation interne)
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
        formContact.addEventListener('submit', function(e) {
            e.preventDefault(); // Bloque le rechargement de la page par défaut
            
            // État visuel de chargement
            btnSubmit.textContent = "Envoi en cours...";
            btnSubmit.disabled = true;
            statusMessage.textContent = "";
            statusMessage.className = "status-message"; // Réinitialise les classes d'erreur/succès

            // Extraction et conversion des données du formulaire en JSON
            const formData = new FormData(formContact);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            // Requête HTTP vers l'API Web3Forms
            fetch('https://web3forms.com', {
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
                    // Le mail est bien envoyé
                    statusMessage.textContent = "Message envoyé avec succès ! Je vous recontacte sous 24h.";
                    statusMessage.classList.add('success');
                    formContact.reset(); // Vide tous les champs du formulaire
                } else {
                    // L'API renvoie une erreur (ex: clé d'accès manquante ou incorrecte)
                    statusMessage.textContent = "Erreur de configuration : " + res.message;
                    statusMessage.classList.add('error');
                }
            })
            .catch(error => {
                // Erreur technique globale (coupure internet, serveur en panne)
                statusMessage.textContent = "Une erreur technique est survenue lors de l'envoi. Veuillez réessayer.";
                statusMessage.classList.add('error');
            })
            .then(() => {
                // Rétablissement du bouton à son état initial dans tous les cas
                btnSubmit.textContent = "Envoyer la demande";
                btnSubmit.disabled = false;
            });
        });
    }
});
