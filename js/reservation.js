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
    
    // CHARGEMENT ET REMPLISSAGE
    try {
        const response = await fetch('../destinations/liste_Destinations.json');
        if (!response.ok) throw new Error("Erreur JSON");
        
        const data = await response.json();
        listeVoyages = data.voyages;

        // Remplir le menu
        remplirMenuDeroulant();

        // SÉLECTION AUTOMATIQUE
        const params = new URLSearchParams(window.location.search);
        const destinationId = params.get('id');
        
        if (destinationId) {
            // Vérifier que l'option existe avant de la sélectionner
            if (listeVoyages.some(v => v.id === destinationId)) {
                inputs.destination.value = destinationId;
                calculerPrix();
            }
        }

    } catch (error) {
        console.error("Erreur:", error);
    }

    // ÉCOUTEURS
    Object.values(inputs).forEach(input => {
        if(input && input !== inputs.prixLabel && input !== inputs.form) {
            input.addEventListener('change', calculerPrix);
            input.addEventListener('input', calculerPrix);
        }
    });

    if(inputs.depart) {
        inputs.depart.addEventListener('change', function() {
            inputs.retour.min = inputs.depart.value;
            if (inputs.retour.value && inputs.retour.value < inputs.depart.value) {
                inputs.retour.value = "";
                calculerPrix();
            }
        });
    }

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
    const destID = inputs.destination.value;
    const dateDepart = new Date(inputs.depart.value);
    const dateRetour = new Date(inputs.retour.value);
    const nbAdultes = parseInt(inputs.adultes.value) || 0;
    const nbEnfants = parseInt(inputs.enfants.value) || 0;
    const hasBreakfast = inputs.breakfast.checked;

    if (!destID || isNaN(dateDepart) || isNaN(dateRetour) || dateRetour <= dateDepart) {
        inputs.prixLabel.innerText = "0";
        return;
    }

    const voyageChoisi = listeVoyages.find(v => v.id === destID);
    if (!voyageChoisi) return;

    const prixBase = voyageChoisi.prix;
    const diffTime = dateRetour - dateDepart;
    const dureeSejour = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let totalAdultes = nbAdultes * prixBase * dureeSejour;
    let totalEnfants = nbEnfants * (prixBase * 0.40) * dureeSejour;
    let totalBreakfast = hasBreakfast ? (15 * (nbAdultes + nbEnfants) * dureeSejour) : 0;

    const prixFinal = totalAdultes + totalEnfants + totalBreakfast;
    inputs.prixLabel.innerText = Math.round(prixFinal);
}