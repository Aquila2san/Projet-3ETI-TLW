// Récupération des éléments du DOM
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

// Variable globale pour stocker les données du JSON
let listeVoyages = [];

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    
    // Chargement des données depuis le JSON
    try {
        const response = await fetch('../destinations/liste_Destinations.json');
        if (!response.ok) throw new Error("Erreur de chargement JSON");
        
        const data = await response.json();
        listeVoyages = data.voyages; // On stocke la liste pour l'utiliser dans le calcul

        // Remplissage du menu
        remplirMenuDeroulant();

    } catch (error) {
        console.error("Impossible de charger les destinations :", error);
        inputs.prixLabel.innerText = "Erreur système";
    }

    // Gestion de l'url
    const params = new URLSearchParams(window.location.search);
    const destinationId = params.get('id');
    
    if (destinationId) {
        // On attend que le menu soit rempli pour sélectionner la valeur
        inputs.destination.value = destinationId;
        // On lance un premier calcul immédiatement
        calculerPrix();
    }

    // Ajout des ecouteurs
    Object.values(inputs).forEach(input => {
        if(input && input !== inputs.prixLabel && input !== inputs.form) {
            input.addEventListener('change', calculerPrix);
            input.addEventListener('input', calculerPrix);
        }
    });

    // Gestion des dates
    if(inputs.depart) {
        inputs.depart.addEventListener('change', function() {
            inputs.retour.min = inputs.depart.value;
            if (inputs.retour.value && inputs.retour.value < inputs.depart.value) {
                inputs.retour.value = "";
                calculerPrix();
            }
        });
    }

    // Blocage du formulaire si erreur
    if (inputs.form) {
        inputs.form.addEventListener('submit', function(event) {
            const dateDepart = new Date(inputs.depart.value);
            const dateRetour = new Date(inputs.retour.value);
            
            if (isNaN(dateDepart) || isNaN(dateRetour) || dateRetour <= dateDepart) {
                event.preventDefault();
                alert("Veuillez vérifier les dates.");
            }
            // Ici, nous ajouterons plus tard la sauvegarde dans le Panier
        });
    }
});

// Fonctions utilitaires

function remplirMenuDeroulant() {
    const select = inputs.destination;
    
    // On garde juste la première option 
    select.innerHTML = '<option value="">-- Choisissez une destination --</option>';

    listeVoyages.forEach(voyage => {
        const option = document.createElement('option');
        option.value = voyage.id; // On utilise l'ID du JSON (ex: "bangkok")
        option.textContent = voyage.ville; // On affiche le nom (ex: "Bangkok")
        select.appendChild(option);
    });
}

function calculerPrix() {
    // 1. Récupération des valeurs
    const destID = inputs.destination.value;
    const dateDepart = new Date(inputs.depart.value);
    const dateRetour = new Date(inputs.retour.value);
    const nbAdultes = parseInt(inputs.adultes.value) || 0;
    const nbEnfants = parseInt(inputs.enfants.value) || 0;
    const hasBreakfast = inputs.breakfast.checked;

    // 2. Validation basique
    if (!destID || isNaN(dateDepart) || isNaN(dateRetour) || dateRetour <= dateDepart) {
        inputs.prixLabel.innerText = "0";
        return;
    }

    // 3. Recherche du prix dans les données JSON chargées
    // C'est ici que la magie opère : on cherche le voyage correspondant à l'ID choisi
    const voyageChoisi = listeVoyages.find(v => v.id === destID);
    
    if (!voyageChoisi) {
        console.error("Destination inconnue");
        return;
    }

    const prixBase = voyageChoisi.prix; // Le prix vient du JSON !

    // 4. Calculs (inchangés)
    const diffTime = dateRetour - dateDepart;
    const dureeSejour = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let totalAdultes = nbAdultes * prixBase * dureeSejour;
    let totalEnfants = nbEnfants * (prixBase * 0.40) * dureeSejour;
    let totalBreakfast = hasBreakfast ? (15 * (nbAdultes + nbEnfants) * dureeSejour) : 0;

    const prixFinal = totalAdultes + totalEnfants + totalBreakfast;

    inputs.prixLabel.innerText = Math.round(prixFinal);
}