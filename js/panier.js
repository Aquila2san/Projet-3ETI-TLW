// js/panier.js

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Récupérer les données du localStorage
    // On convertit la chaîne JSON en objet JavaScript
    const panier = JSON.parse(localStorage.getItem('monPanier'));

    const blocVide = document.getElementById('panier-vide');
    const blocPlein = document.getElementById('panier-plein');
    const btnActions = document.querySelector('.boutons'); // Les boutons Modifier/Confirmer

    // 2. Vérifier si le panier contient quelque chose
    if (!panier || panier.length === 0) {
        // Panier vide
        if(blocVide) blocVide.style.display = 'block';
        if(blocPlein) blocPlein.style.display = 'none';
        if(btnActions) btnActions.style.display = 'none'; // On cache les boutons d'action
    } else {
        // Panier plein : On récupère la DERNIÈRE réservation ajoutée
        // (Le sujet semble impliquer une seule réservation active à la fois pour la simplification)
        const resa = panier[panier.length - 1];

        if(blocVide) blocVide.style.display = 'none';
        if(blocPlein) blocPlein.style.display = 'block';

        // 3. Affichage des données
        document.getElementById('panier-dest').textContent = resa.destinationNom;
        document.getElementById('panier-depart').textContent = resa.dateDepart;
        document.getElementById('panier-retour').textContent = resa.dateRetour;
        document.getElementById('panier-adultes').textContent = resa.adultes;
        document.getElementById('panier-enfants').textContent = resa.enfants;
        
        // Affichage Oui/Non pour le petit déjeuner
        const dejTexte = resa.petitDejeuner ? "Oui" : "Non";
        document.getElementById('panier-dej').textContent = dejTexte;

        document.getElementById('panier-prix').textContent = resa.prixTotal + " €";

        // 4. Gestion du bouton "Vider le panier" 
        const btnSuppr = document.getElementById('bouton_supprimer');
        if(btnSuppr) {
            btnSuppr.addEventListener('click', () => {
                // On vide le localStorage
                localStorage.removeItem('monPanier');
                // On recharge la page pour afficher l'état vide
                window.location.reload();
            });
        }
    }
});