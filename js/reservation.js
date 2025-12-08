// 1. On liste tous les champs dont on a besoin
const inputs = {
    destination: document.getElementById('destination'),
    depart: document.getElementById('depart'),
    retour: document.getElementById('retour'),
    adultes: document.getElementById('adultes'),
    enfants: document.getElementById('enfants'),
    breakfast: document.getElementById('breakfast'),
    prixLabel: document.getElementById('prixTotal'),
    form: document.getElementById('formReservation')
};

// Variable pour stocker la liste des voyages chargée depuis le JSON
let listeVoyages = [];

// 2. Au chargement de la page (équivalent à $(document).ready en jQuery)
document.addEventListener('DOMContentLoaded', async () => {
    
    // --- A. CHARGEMENT DES DONNÉES ---
    try {
        // On récupère le fichier JSON
        const response = await fetch('../destinations/liste_Destinations.json');
        const data = await response.json();
        listeVoyages = data.voyages; // On stocke les voyages

        // On remplit le menu déroulant
        remplirMenuDeroulant();

        // Si on vient de la page d'accueil avec un ID (ex: ?id=bangkok)
        const params = new URLSearchParams(window.location.search);
        const destinationId = params.get('id');
        
        // On pré-sélectionne la destination
        if (destinationId) {
            inputs.destination.value = destinationId;
            calculerPrix(); // On lance un premier calcul
        }

    } catch (error) {
        console.error("Erreur de chargement :", error);
    }

    // --- B. ÉCOUTEURS D'ÉVÉNEMENTS ---
    const champsAecouter = [inputs.destination, inputs.depart, inputs.retour, inputs.adultes, inputs.enfants, inputs.breakfast];
    
    champsAecouter.forEach(element => {
        if (element) {
            element.addEventListener('change', calculerPrix);
            element.addEventListener('input', calculerPrix);
        }
    });

    // --- C. SÉCURITÉ DES DATES ---
    if(inputs.depart) {
        inputs.depart.addEventListener('change', function() {
            // 1. On récupère la date de départ choisie
            const dateDepart = inputs.depart.value;
            
            // 2. On force la date de retour minimum à cette date
            inputs.retour.min = dateDepart;

            // 3. Si une date de retour invalide était déjà mise, on l'efface
            if (inputs.retour.value < dateDepart) {
                inputs.retour.value = "";
                calculerPrix();
            }
        });
    }

    // --- D. SAUVEGARDE DANS LE PANIER ---
    if (inputs.form) {
        inputs.form.addEventListener('submit', function(event) {
            event.preventDefault();

            // 1. Validation : On vérifie que les dates sont logiques
            const dateDepart = new Date(inputs.depart.value);
            const dateRetour = new Date(inputs.retour.value);
            
            if (dateRetour <= dateDepart) {
                alert("Attention : La date de retour doit être après le départ.");
                return; // On arrête tout
            }

            // 2. Création de l'objet "Réservation"
            const voyageInfos = listeVoyages.find(v => v.id === inputs.destination.value);
            
            const nouvelleReservation = {
                destinationNom: voyageInfos ? voyageInfos.ville : "Destination inconnue",
                dateDepart: inputs.depart.value,
                dateRetour: inputs.retour.value,
                adultes: inputs.adultes.value,
                enfants: inputs.enfants.value,
                petitDejeuner: inputs.breakfast.checked,
                prixTotal: parseInt(inputs.prixLabel.innerText)
            };

            // 3. Sauvegarde dans le LocalStorage
            let panierInfos = localStorage.getItem('monPanier');
            let panier = [];

            if (panierInfos) {
                try {
                    panier = JSON.parse(panierInfos);
                    if (!Array.isArray(panier)) panier = [];
                } catch (e) {
                    panier = [];
                }
            }
            panier.push(nouvelleReservation);
            localStorage.setItem('monPanier', JSON.stringify(panier));
            window.location.href = "panier.html";
        });
    }
});

// --- FONCTIONS UTILITAIRES ---

function remplirMenuDeroulant() {
    const select = inputs.destination;
    select.innerHTML = '<option value="">-- Choisissez --</option>';
    
    listeVoyages.forEach(voyage => {
        const option = document.createElement('option');
        option.value = voyage.id;      // La valeur technique (ex: bangkok)
        option.textContent = voyage.ville; // Le texte affiché (ex: Bangkok)
        select.appendChild(option);
    });
}

function calculerPrix() {
    // 1. On récupère toutes les valeurs
    const dest = inputs.destination.value;
    const d1 = new Date(inputs.depart.value);
    const d2 = new Date(inputs.retour.value);
    const nbAdultes = parseInt(inputs.adultes.value) || 0;
    const nbEnfants = parseInt(inputs.enfants.value) || 0;
    const petitDej = inputs.breakfast.checked;

    // 2. Si manque d'infos, on met 0
    if (!dest || isNaN(d1) || isNaN(d2) || d2 <= d1) {
        inputs.prixLabel.innerText = "0";
        return;
    }

    // 3. On trouve le prix de la destination
    const voyage = listeVoyages.find(v => v.id === dest);
    if (!voyage) return;

    // 4. Calcul mathématique
    const duree = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)); // Durée en jours
    
    let total = (nbAdultes * voyage.prix * duree);       // Prix adultes
    total += (nbEnfants * (voyage.prix * 0.40) * duree); // Prix enfants (40%)
    
    if (petitDej) {
        total += (nbAdultes + nbEnfants) * 15 * duree;   // Prix petit-déj
    }

    inputs.prixLabel.innerText = Math.round(total);
}