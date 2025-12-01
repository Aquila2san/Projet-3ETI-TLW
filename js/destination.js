document.addEventListener('DOMContentLoaded', async () => {
    // Récupérer l'ID dans l'URL
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
            // Textes
            document.getElementById('dest-titre').innerText = voyage.ville;
            document.getElementById('dest-pays').innerText = voyage.pays;
            document.getElementById('dest-description').innerText = voyage.description;
            document.getElementById('dest-prix').innerText = voyage.prix;

            // Image en fond 
            const affiche = document.getElementById("affiche_destination");
            
            affiche.style.backgroundImage = `url(../destinations/${voyage.image1})`;
            affiche.style.backgroundSize = "cover";       
            affiche.style.backgroundPosition = "center";  
            affiche.style.backgroundAttachment = "fixed"; 

            // Mise à jour du lien
            const lienReservation = document.getElementById('btn-reserver');
            lienReservation.href = `reservation.html?id=${id}`;
        } else {
            console.error("Voyage non trouvé pour l'id : " + id);
        }
        
    } catch (error) {
        console.error("Erreur", error);
    }
})