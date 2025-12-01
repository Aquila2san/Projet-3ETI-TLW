document.addEventListener('DOMContentLoaded', async () => {
    // Récupérer l'ID dans l'URL (ex: ?id=bangkok)
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) return; // Si pas d'ID, on ne fait rien

    // Charger le JSON
    try {
        const response = await fetch('../destinations/liste_Destinations.json');
        const data = await response.json();
                
        // Trouver le bon voyage dans la liste "voyages"
        const voyage = data.voyages.find(v => v.id === id);

        if (voyage) {
            // Remplir la page
            document.getElementById('dest-titre').innerText = voyage.ville;
            document.getElementById('dest-pays').innerText = voyage.pays;
            document.getElementById('dest-description').innerText = voyage.description;
            document.getElementById('dest-prix').innerText = voyage.prix;
            document.getElementById('dest-image').src = voyage.image1;

            // Mettre à jour le lien "Réserver" pour qu'il garde l'ID en mémoire
            document.getElementById('btn-reserver').href = `reservation.html?id=${id}`;
        }
    } catch (error) {
        console.error("Erreur", error);
    }
})