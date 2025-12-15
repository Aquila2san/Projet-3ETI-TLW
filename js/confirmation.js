document.addEventListener('DOMContentLoaded', () => {
    afficherConfirmation();
});

function afficherConfirmation() {
    // 1. Récupérer la commande validée
    const commandeStr = localStorage.getItem('commandeValidee');

    const commande = JSON.parse(commandeStr);

    // 2. Afficher les infos globales
    document.getElementById('conf-id').textContent = commande.id;
    document.getElementById('conf-nom').textContent = commande.client.nom;
    document.getElementById('conf-email').textContent = commande.client.email;
    document.getElementById('conf-total').textContent = commande.montantTotal + " €";

    // 3. Afficher le détail des voyages (si plusieurs dans le panier)
    const container = document.getElementById('conf-liste-voyages');
    container.innerHTML = ""; // Vider par précaution

    commande.contenu.forEach(voyage => {
        const p = document.createElement('p');
        p.innerHTML = `
            Destination : ${voyage.destinationNom}<br>
            Du ${new Date(voyage.dateDepart).toLocaleDateString()} au ${new Date(voyage.dateRetour).toLocaleDateString()}<br>
            (${voyage.adultes} adultes, ${voyage.enfants} enfants)
        `;
        p.style.marginBottom = "15px";
        container.appendChild(p);
    });

    // 4. Vider le panier maintenant que la commande est confirmée
    localStorage.removeItem('monPanier');
}