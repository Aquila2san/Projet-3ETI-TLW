var last_call_API = Date.now();
sessionStorage.setItem("last_call_API", last_call_API);

async function get_temperature () {
  //on va chercher la cle API dans le JSON
  fetch("../keys.json")
  .then(response => {
    return response.json()
  })
  .then(cles => {
    const weatherKEY = cles.weatherAPI;
    const str_weatherKEY = JSON.stringify(weatherKEY);
    sessionStorage.setItem("cle_meteo", str_weatherKEY);

    temperature_update();
  })

  var initialiser = true;

  async function temperature_update () {
    fetch("../destinations/liste_Destinations.json")
    .then(response => response.json())
    .then(async data => {
      const str_weatherKEY = sessionStorage.getItem("cle_meteo");
      const weatherKEY = JSON.parse(str_weatherKEY);
      var date = sessionStorage.getItem("last_call_API");
      date = JSON.stringify(date);
      if (date - Date.now() > 1000*60*10 || initialiser) { //si temp vide ou obsolete
        date = JSON.stringify(Date.now("last_call_API"));
        initialiser = false;
        sessionStorage.setItem("last_call_API",date); //actualiser la date du doc
       
        for (let i = 0; i < data.voyages.length; i++) {
          const voyage = data.voyages[i];

          const temp = await temperature_API(voyage.latitude, voyage.longitude, weatherKEY);

          console.log(temp);

          data.voyages[i].temperature = temp;
          
          console.log(data) //Pour afficher la data avec temperatures
        }
        const temperatures_aJour = JSON.stringify(data);
        sessionStorage.setItem("voyages", temperatures_aJour);

        actualiser_HTML(data);
      }
    })
    }
  

  async function temperature_API (lat,lon,APIkey) {
    return await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`)
    .then(response => response.json())
    .then(data =>{
      const temperature = Math.round(data.main.temp -273.15);
      return temperature;
    })
  }
  
  function actualiser_HTML (data) {
    data.voyages.forEach(voyage => {
      const element = document.getElementById(`temperature-${voyage.id}`);
      element.innerText = `${voyage.temperature}°C`;
    })
  }
}


fetch("../destinations/liste_Destinations.json")
.then(texte_brut => texte_brut.json())
.then(data => {
  const grille = document.getElementById("grid_cellules");
  data.voyages.forEach(voyage => {
    const a = document.createElement("a");
    a.id = voyage.id;
    a.className = "cellule";
    a.href = `destination.html?id=${voyage.id}`;
    a.dataset.animaux = `${voyage.animaux}`;
    a.style.backgroundImage = `url(../destinations/${voyage.image1})`;
    
    const p = document.createElement("p");
    p.textContent = `${voyage.ville}, ${voyage.pays}`;
    p.className = "titre";

    const p2 = document.createElement("p");
    p2.textContent = `${voyage.temperature}°C`;
    p2.id = `temperature-${voyage.id}`;
    p2.className = "temperature";

    
    a.appendChild(p);
    a.appendChild(p2);
    grille.appendChild(a);
  });

  get_temperature();
})
.catch(err => console.error("Erreur JSON :", err));

function filtreAnimaux (){
  for (dest of document.getElementById("grid_cellules").children) {
    if (dest.dataset.animaux === "non") {
      dest.classList.toggle("masquer")
    }
  }
}
