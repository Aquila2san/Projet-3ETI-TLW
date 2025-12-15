fetch("../destinations/liste_Destinations.json")
.then(texte_brut => texte_brut.json())
.then(data => {
  const grille = document.getElementById("grid_cellules");
/*  if (data.last_call_API === "none" || data.last_call_API - Date.now() < 1000*60*10()){
    var date = JSON.stringify(Date.now());
    sessionStorage.setItem("last_call_API",date);
    data.voyages.forEach(voyage => {
    var lat = voyage.latitude;
    var lon = voyage.longitude;

    })*/
  data.voyages.forEach(voyage => {
    const a = document.createElement("a");
    var lat = voyage.latitude;
    var lon = voyage.longitude;
    apiTemperature (voyage, lat, lon, APIkey, a);
    a.textContent = `${voyage.ville}, ${voyage.pays}, ${voyage.temperature}`;
    a.className = "cellule";
    a.href = `destination.html?id=${voyage.id}`;
    a.dataset.animaux = `${voyage.animaux}`;
    a.style.backgroundImage = `url(../destinations/${voyage.image1})`;
    grille.appendChild(a);

  })
})
.catch(err => console.error("Erreur JSON :", err));

async function apiTemperature (data2, lat, lon, APIkey, targetElt) {
  await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`)
  .then(response => {
    return response.json();
  })
  .then(data => {
    data2.temperature = Math.round(data.main.temp -273.15);
    targetElt.textContent += " " + data2.temperature
  })
}

function filtreAnimaux (){
  for (dest of document.getElementById("grid_cellules").children) {
    if (dest.dataset.animaux === "non")
      dest.classList.toggle("masquer")
  }
}
