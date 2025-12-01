fetch("../destinations/liste_Destinations.json")
  .then(texte_brut => texte_brut.json())
  .then(data => {
  const grille = document.getElementById("grid_cellules");

  data.voyages.forEach(voyage => {
    const a = document.createElement("a");
    a.textContent = `${voyage.ville}, ${voyage.pays}`;
    a.className = "cellule";
    a.href = `destination.html?id=${voyage.identifiant}`;
    a.style.backgroundImage = `url(../destinations/${voyage.image1})`;
    grille.appendChild(a);
  });
})
.catch(err => console.error("Erreur JSON :", err));
