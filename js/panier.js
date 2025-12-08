document.addEventListener('DOMContentLoaded', () => {
    afficherPanier();
});

function afficherPanier() {
    // 1. Récupération sécurisée du panier
    let panier = [];
    try {
        const memoire = localStorage.getItem('monPanier');
        if (memoire) {
            panier = JSON.parse(memoire);
            if (!Array.isArray(panier)) panier = [];
        }
    } catch (e) {
        panier = [];
    }

    // 2. Éléments HTML
    const zoneListe = document.getElementById('liste-reservations');
    const blocVide = document.getElementById('panier-vide');
    const blocActions = document.getElementById('panier-actions');
    const labelTotal = document.getElementById('total-global');
    zoneListe.innerHTML = "";
    
    // 3. Panier vide ou plein
    if (panier.length === 0) {
        blocVide.classList.remove('hidden');   // On affiche le vide
        blocActions.classList.add('hidden');   // On cache les actions
    } else {
        blocVide.classList.add('hidden');      // On cache le vide
        blocActions.classList.remove('hidden');// On affiche les actions

        let totalGlobal = 0;

        // 4. Génération de la liste
        panier.forEach((resa, index) => {
            totalGlobal += resa.prixTotal;

            const div = document.createElement('div');
            div.className = 'recap_box';
            div.innerHTML = `
                <button onclick="supprimerLigne(${index})">Supprimer</button>
                <h2>${resa.destinationNom}</h2>
                
                <p>Du ${formatDate(resa.dateDepart)} au ${formatDate(resa.dateRetour)}</p>
                <p>${resa.adultes} Adulte(s), ${resa.enfants} Enfant(s)</p>
                <p>Petit-déjeuner : ${resa.petitDejeuner ? "Oui" : "Non"}</p>
                
                <p class="prix-article">${resa.prixTotal} €</p>
            `;

            zoneListe.appendChild(div);
        });

        labelTotal.innerText = totalGlobal;
    }
}

// Fonction de suppression
window.supprimerLigne = function(index) {
    let panier = JSON.parse(localStorage.getItem('monPanier')) || [];
    panier.splice(index, 1);
    localStorage.setItem('monPanier', JSON.stringify(panier));
    afficherPanier(); 
};

// Utilitaire date
function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}