document.addEventListener('DOMContentLoaded', () => {
    chargerResume();
    gererPaiement();
});

function chargerResume() {
    // 1. Récupérer le panier
    const panier = JSON.parse(localStorage.getItem('monPanier')) || [];

    // 2. Préparation des éléments HTML
    const container = document.getElementById('liste-panier-paiement');
    const totalSpan = document.getElementById('rec-total');
    let totalGlobal = 0;
    const optionsDate = { day: 'numeric', month: 'long', year: 'numeric' };

    // Vider le conteneur par sécurité
    container.innerHTML = "";

    // 3. Génération de l'affichage pour chaque voyage
    panier.forEach((voyage, index) => {
        totalGlobal += voyage.prixTotal;

        // Création d'un bloc visuel pour le voyage
        const divVoyage = document.createElement('div');
        divVoyage.style.marginBottom = "15px"; // Un peu d'espace entre les voyages
        divVoyage.style.paddingBottom = "15px";
        
        // Ajout d'une petite ligne de séparation sauf pour le dernier
        if (index < panier.length - 1) {
            divVoyage.style.borderBottom = "1px solid #ddd";
        }

        // Construction du HTML
        divVoyage.innerHTML = `
            <p>Destination : ${voyage.destinationNom}</p>
            <p>Du ${new Date(voyage.dateDepart).toLocaleDateString('fr-FR', optionsDate)} 
               au ${new Date(voyage.dateRetour).toLocaleDateString('fr-FR', optionsDate)}</p>
            <p>
                ${voyage.adultes} Adulte(s), ${voyage.enfants} Enfant(s) 
                <br>
                Petit-déjeuner : ${voyage.petitDejeuner ? "Oui" : "Non"}
            </p>
            <p>${voyage.prixTotal} €</p>
        `;

        container.appendChild(divVoyage);
    });

    // 4. Affichage du total final
    totalSpan.textContent = totalGlobal + " €";
}

function gererPaiement() {
    const form = document.querySelector('form');
    
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); 

            const client = {
                nom: document.getElementById('titulaire').value,
                email: document.getElementById('email').value,
                adresse: document.getElementById('adresse').value
            };

            const panier = JSON.parse(localStorage.getItem('monPanier'));
            
            let total = 0;
            if(panier) panier.forEach(p => total += p.prixTotal);

            const commande = {
                id: Math.floor(Math.random() * (9999 - 1111 + 1)) + 1111,
                dateCommande: new Date().toLocaleDateString(),
                client: client,
                contenu: panier,
                montantTotal: total
            };

            localStorage.setItem('commandeValidee', JSON.stringify(commande));
            
            // Redirection
            window.location.href = "confirmation.html";
        });
    }
}