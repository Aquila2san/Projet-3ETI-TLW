const destinationsData = {
    "bangkok": { prix: 80 }, // Prix par adulte par jour
    "sydney": { prix: 150 },
    "st-petersburg": { prix: 120 },
    "bogota": { prix: 100 }
};

//Récupération des éléments du documents des destinations
const inputs = {
    destination: document.getElementById('destination'),
    depart: document.getElementById('depart'),
    retour: document.getElementById('retour'),
    adultes: document.getElementById('adultes'),
    enfants: document.getElementById('enfants'),
    breakfast: document.getElementById('breakfast'),
    prixLabel: document.getElementById('prixTotal')
};

//Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const destinationId = params.get('id');

    if (destinationId && destinationsData[destinationId]) {
        inputs.destination.value = destinationId;
    }

    Object.values(inputs).forEach(input => {
        if(input && input !== inputs.prixLabel) {
            input.addEventListener('change', calculerPrix);
            input.addEventListener('input', calculerPrix);
        }
    });

    //Gestion des dates (grise le calendrier)
    inputs.depart.addEventListener('change', function() {
        const dateDepartChoisie = inputs.depart.value;
        inputs.retour.min = dateDepartChoisie;
        
        if (inputs.retour.value && inputs.retour.value < dateDepartChoisie) {
            inputs.retour.value = "";
            inputs.prixLabel.innerText = "0";
        }
    });

    //Blocage de l'envoi du formulaire si dates invalides
    if (formReservation) {
        formReservation.addEventListener('submit', function(event) {
            const dateDepart = new Date(inputs.depart.value);
            const dateRetour = new Date(inputs.retour.value);

            if (isNaN(dateDepart) || isNaN(dateRetour) || dateRetour <= dateDepart) {
                event.preventDefault();
                alert("Veuillez corriger les dates avant de réserver.");
            }
        });
    }

    //Premier calcul à l'ouverture de la page
    calculerPrix();
});

//Fonction de calcul du prix
function calculerPrix() {
    const dest = inputs.destination.value;
    const dateDepart = new Date(inputs.depart.value);
    const dateRetour = new Date(inputs.retour.value);
    const nbAdultes = parseInt(inputs.adultes.value) || 0;
    const nbEnfants = parseInt(inputs.enfants.value) || 0;
    const hasBreakfast = inputs.breakfast.checked;
    if (!dest || isNaN(dateDepart) || isNaN(dateRetour)) {
        inputs.prixLabel.innerText = "0";
        return;
    }

    // Calcul de la durée du séjour
    const diffTime = dateRetour - dateDepart;
    const dureeSejour = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Vérification de la validité
    if (dureeSejour <= 0) {
        inputs.prixLabel.innerText = "Erreur dates";
        return;
    }

    // Récupération du prix de base pour la destination choisie
    const prixBase = destinationsData[dest] ? destinationsData[dest].prix : 0;
    
    //Prix Adultes
    let totalAdultes = nbAdultes * prixBase * dureeSejour;

    //Prix Enfants
    let prixEnfantParJour = prixBase * 0.40;
    let totalEnfants = nbEnfants * prixEnfantParJour * dureeSejour;

    //Petit déjeuner
    let totalBreakfast = 0;
    if (hasBreakfast) {
        const prixDej = 15;
        const nbPersonnes = nbAdultes + nbEnfants;
        totalBreakfast = nbPersonnes * prixDej * dureeSejour;
    }

    // Total final
    const prixFinal = totalAdultes + totalEnfants + totalBreakfast;

    // Affichage
    inputs.prixLabel.innerText = Math.round(prixFinal);
}