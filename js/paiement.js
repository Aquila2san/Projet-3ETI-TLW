document.addEventListener('DOMContentLoaded', () => {
    chargerResume();
    gererPaiement();
});

function chargerResume() {
    const panier = JSON.parse(localStorage.getItem('monPanier')) || [];
    const container = document.getElementById('liste-panier-paiement');
    const totalSpan = document.getElementById('rec-total');
    let totalGlobal = 0;
    const optionsDate = { day: 'numeric', month: 'long', year: 'numeric' };

    container.innerHTML = "";

    panier.forEach((voyage, index) => {
        totalGlobal += voyage.prixTotal;
        const divVoyage = document.createElement('div');
        divVoyage.style.marginBottom = "15px"; 
        divVoyage.style.paddingBottom = "15px";
        if (index < panier.length - 1) {
            divVoyage.style.borderBottom = "1px solid #ddd";
        }

        divVoyage.innerHTML = `
            <p>Destination : ${voyage.destinationNom}</p>
            <p>Du ${new Date(voyage.dateDepart).toLocaleDateString('fr-FR', optionsDate)} 
               au ${new Date(voyage.dateRetour).toLocaleDateString('fr-FR', optionsDate)}</p>
            <p>${voyage.prixTotal} €</p>
        `;
        container.appendChild(divVoyage);
    });

    totalSpan.textContent = totalGlobal + " €";
}

function gererPaiement() {
    const form = document.querySelector('form');
    
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); 

            // 1. Récupération des infos client et panier
            const client = {
                nom: document.getElementById('titulaire').value,
                email: document.getElementById('email').value,
                adresse: document.getElementById('adresse').value
            };
            const panier = JSON.parse(localStorage.getItem('monPanier')) || [];
            
            let total = 0;
            panier.forEach(p => total += p.prixTotal);

            const commande = {
                id: Math.floor(Math.random() * (9999 - 1111 + 1)) + 1111,
                dateCommande: new Date().toLocaleDateString(),
                client: client,
                contenu: panier,
                montantTotal: total
            };
            
            // 2. Sauvegarde de la commande globale
            localStorage.setItem('commandeValidee', JSON.stringify(commande));
            
            // SAUVEGARDE DANS L'HISTORIQUE UTILISATEUR
            const currentUserEmail = localStorage.getItem('travelo_utilisateur_actuel');
            
            if (currentUserEmail && panier.length > 0) {
                let usersDB = JSON.parse(localStorage.getItem('travelo_utilisateur_donnees') || '[]');
                const userIndex = usersDB.findIndex(u => u.email === currentUserEmail);

                if (userIndex !== -1) {
                    if (!usersDB[userIndex].historique) {
                        usersDB[userIndex].historique = [];
                    }

                    // On boucle sur CHAQUE article du panier pour l'ajouter à l'historique
                    panier.forEach(voyage => {
                        const entreeHistorique = {
                            destination: voyage.destinationNom,
                            date: voyage.dateDepart,
                            prix: voyage.prixTotal
                        };
                        usersDB[userIndex].historique.push(entreeHistorique);
                    });

                    // On sauvegarde la DB mise à jour
                    localStorage.setItem('travelo_utilisateur_donnees', JSON.stringify(usersDB));
                    console.log(panier.length + " voyages ajoutés à l'historique de " + currentUserEmail);
                }
            }
            // Redirection vers confirmation
            window.location.href = "confirmation.html";
        });
    }
}