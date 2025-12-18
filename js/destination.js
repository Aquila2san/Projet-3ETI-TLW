document.addEventListener('DOMContentLoaded', async () => {
    // 1. Récupérer l'ID dans l'URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) return; 

    // 2. Charger le JSON
    try {
        const response = await fetch('../destinations/liste_Destinations.json');
        const data = await response.json();
        
        // Trouver le voyage correspondant
        const voyage = data.voyages.find(v => v.id == id);

        if (voyage) {
            // 3. Remplir les textes
            document.getElementById('dest-titre').innerText = voyage.ville;
            document.getElementById('dest-pays').innerText = voyage.pays;
            document.getElementById('dest-description').innerText = voyage.description;
            document.getElementById('dest-prix').innerText = voyage.prix;

            // 4. Mettre l'image de fond
            const affiche = document.getElementById("affiche_destination");
            affiche.style.backgroundImage = `url('../destinations/${voyage.image1}')`;

            // 5. Mettre à jour le lien vers la réservation
            const lienReservation = document.getElementById('btn-reserver');
            lienReservation.href = `reservation.html?id=${id}`;
        } else {
            console.error("Voyage introuvable : " + id);
            document.getElementById('dest-titre').innerText = "Voyage introuvable";
        }
        
    } catch (error) {
        console.error("Erreur chargement JSON :", error);
    }
});