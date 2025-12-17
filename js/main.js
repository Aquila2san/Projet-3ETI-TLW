fetch("../destinations/liste_Destinations.json")
.then(texte_brut => texte_brut.json())
.then(data => {
  const grille = document.getElementById("grid_cellules");
  data.voyages.forEach(voyage => {
    const a = document.createElement("a");
    var lat = voyage.latitude;
    var lon = voyage.longitude;
    a.textContent = `${voyage.ville}, ${voyage.pays}, ${voyage.temperature}`;
    a.className = "cellule";
    a.href = `destination.html?id=${voyage.id}`;
    a.dataset.animaux = `${voyage.animaux}`;
    a.style.backgroundImage = `url(../destinations/${voyage.image1})`;
    grille.appendChild(a);

  })
})


function filtreAnimaux (){
  for (dest of document.getElementById("grid_cellules").children) {
    if (dest.dataset.animaux === "non")
      dest.classList.toggle("masquer")
  }
}
