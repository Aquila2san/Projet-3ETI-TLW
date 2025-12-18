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

let listeVoyages = [];

// 2. Au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    
    // A. CHARGEMENT DES DONNÉES
    try {
        const response = await fetch('../destinations/liste_Destinations.json');
        const data = await response.json();
        listeVoyages = data.voyages; 

        remplirMenuDeroulant();
        const params = new URLSearchParams(window.location.search);
        const destinationId = params.get('id');
        if (destinationId) {
            inputs.destination.value = destinationId;
            calculerPrix(); 
            changerImageFond();
        }

    } catch (error) {
        console.error("Erreur de chargement :", error);
    }

    // B. ÉCOUTEURS D'ÉVÉNEMENTS
    if (inputs.destination) {
        inputs.destination.addEventListener('change', changerImageFond);
    }

    const champsAecouter = [inputs.destination, inputs.depart, inputs.retour, inputs.adultes, inputs.enfants, inputs.breakfast];
    champsAecouter.forEach(element => {
        if (element) {
            element.addEventListener('change', calculerPrix);
            element.addEventListener('input', calculerPrix);
        }
    });

    // C. SÉCURITÉ DES DATES
    if(inputs.depart) {
        inputs.depart.addEventListener('change', function() {
            const dateDepart = inputs.depart.value;
            inputs.retour.min = dateDepart;

            if (inputs.retour.value < dateDepart) {
                inputs.retour.value = "";
                calculerPrix();
            }
        });
    }

    // D. SAUVEGARDE DANS LE PANIER
    if (inputs.form) {
        inputs.form.addEventListener('submit', function(event) {
            event.preventDefault();

            // Validation dates
            const dateDepart = new Date(inputs.depart.value);
            const dateRetour = new Date(inputs.retour.value);
            
            if (dateRetour <= dateDepart) {
                alert("Attention : La date de retour doit être après le départ.");
                return; 
            }

            // Création de l'objet "Réservation"
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

            // Sauvegarde dans le panier local
            let panierInfos = localStorage.getItem('monPanier');
            let panier = [];
            if (panierInfos) {
                try { panier = JSON.parse(panierInfos); } catch (e) { panier = []; }
            }
            if (!Array.isArray(panier)) panier = [];
            panier.push(nouvelleReservation);
            localStorage.setItem('monPanier', JSON.stringify(panier));

            // Redirection vers le panier
            window.location.href = "panier.html";
        });
    }
});

// FONCTIONS UTILITAIRES

function remplirMenuDeroulant() {
    const select = inputs.destination;
    select.innerHTML = '<option value="" data-image="">-- Choisissez --</option>';
    listeVoyages.forEach(voyage => {
        const option = document.createElement('option');
        option.value = voyage.id;      
        option.textContent = voyage.ville; 
        option.dataset.image = voyage.image1; 
        select.appendChild(option);
    });
}

function changerImageFond() {
    const select = inputs.destination;
    const selectedOption = select.options[select.selectedIndex];
    const imageName = selectedOption.dataset.image;
    if (imageName) {
        document.body.style.backgroundImage = `url('../destinations/${imageName}')`;
    } else {
        document.body.style.backgroundImage = 'none';
    }
}

function calculerPrix() {
    const dest = inputs.destination.value;
    const d1 = new Date(inputs.depart.value);
    const d2 = new Date(inputs.retour.value);
    const nbAdultes = parseInt(inputs.adultes.value) || 0;
    const nbEnfants = parseInt(inputs.enfants.value) || 0;
    const petitDej = inputs.breakfast.checked;

    if (!dest || isNaN(d1) || isNaN(d2) || d2 <= d1) {
        inputs.prixLabel.innerText = "0";
        return;
    }

    const voyage = listeVoyages.find(v => v.id === dest);
    if (!voyage) return;

    const duree = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)); 
    let total = (nbAdultes * voyage.prix * duree);       
    total += (nbEnfants * (voyage.prix * 0.40) * duree); 
    if (petitDej) { total += (nbAdultes + nbEnfants) * 15 * duree; }

    inputs.prixLabel.innerText = Math.round(total);
}