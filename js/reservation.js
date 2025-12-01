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

let listeVoyages = [];

document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. Chargement des données JSON
    try {
        const response = await fetch('../destinations/liste_Destinations.json');
        if (!response.ok) throw new Error("Erreur JSON");
        
        const data = await response.json();
        listeVoyages = data.voyages;

        // Remplissage du menu déroulant
        remplirMenuDeroulant();

        // 2. Gestion de la pré-sélection via l'URL
        const params = new URLSearchParams(window.location.search);
        const destinationId = params.get('id');
        
        if (destinationId && listeVoyages.some(v => v.id === destinationId)) {
            inputs.destination.value = destinationId;
            calculerPrix();
        }

    } catch (error) {
        console.error("Erreur:", error);
    }

    // 3. Ajout des écouteurs pour le calcul automatique
    Object.values(inputs).forEach(input => {
        if(input && input !== inputs.prixLabel && input !== inputs.form) {
            input.addEventListener('change', calculerPrix);
            input.addEventListener('input', calculerPrix);
        }
    });

    // 4. Gestion des dates (Retour >= Départ)
    if(inputs.depart) {
        inputs.depart.addEventListener('change', function() {
            inputs.retour.min = inputs.depart.value;
            if (inputs.retour.value && inputs.retour.value < inputs.depart.value) {
                inputs.retour.value = "";
                calculerPrix();
            }
        });
    }

    // 5. Blocage de l'envoi si données invalides
    if (inputs.form) {
        inputs.form.addEventListener('submit', function(event) {
            const dateDepart = new Date(inputs.depart.value);
            const dateRetour = new Date(inputs.retour.value);
            
            if (isNaN(dateDepart) || isNaN(dateRetour) || dateRetour <= dateDepart) {
                event.preventDefault();
                alert("Veuillez vérifier les dates.");
            }
        });
    }
});

// --- Fonctions ---

function remplirMenuDeroulant() {
    const select = inputs.destination;
    select.innerHTML = '<option value="">-- Choisissez une destination --</option>';

    listeVoyages.forEach(voyage => {
        const option = document.createElement('option');
        option.value = voyage.id;
        option.textContent = voyage.ville;
        select.appendChild(option);
    });
}

function calculerPrix() {
    // Récupération des valeurs
    const destID = inputs.destination.value;
    const dateDepart = new Date(inputs.depart.value);
    const dateRetour = new Date(inputs.retour.value);
    const nbAdultes = parseInt(inputs.adultes.value) || 0;
    const nbEnfants = parseInt(inputs.enfants.value) || 0;
    const hasBreakfast = inputs.breakfast.checked;

    // Vérification basique
    if (!destID || isNaN(dateDepart) || isNaN(dateRetour) || dateRetour <= dateDepart) {
        inputs.prixLabel.innerText = "0";
        return;
    }

    // Récupération du prix depuis la liste chargée
    const voyageChoisi = listeVoyages.find(v => v.id === destID);
    if (!voyageChoisi) return;

    const prixBase = voyageChoisi.prix;
    
    // Calcul durée
    const diffTime = dateRetour - dateDepart;
    const dureeSejour = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Application des règles
    let totalAdultes = nbAdultes * prixBase * dureeSejour;
    let totalEnfants = nbEnfants * (prixBase * 0.40) * dureeSejour; // -60% pour les enfants
    let totalBreakfast = hasBreakfast ? ((nbAdultes + nbEnfants) * 15 * dureeSejour) : 0;

    const prixFinal = totalAdultes + totalEnfants + totalBreakfast;

    // Affichage
    inputs.prixLabel.innerText = Math.round(prixFinal);
}