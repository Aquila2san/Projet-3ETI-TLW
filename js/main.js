var last_call_API = Date.now();
sessionStorage.setItem("last_call_API", last_call_API);
var initialiser = true;

async function get_temperature () {
  //on va chercher la cle API dans le JSON
  fetch("../keys.json")
  .then(response => {
    return response.json()
  })
  .then(cles => {
    //on stocke la clé dans le sessionStorage
    const weatherKEY = cles.weatherAPI;
    const str_weatherKEY = JSON.stringify(weatherKEY);
    sessionStorage.setItem("cle_meteo", str_weatherKEY);

    temperature_update();
  })

  

  async function temperature_update () {
    fetch("../destinations/liste_Destinations.json")
    .then(response => response.json())
    .then(async data => {
      const str_weatherKEY = sessionStorage.getItem("cle_meteo");
      const weatherKEY = JSON.parse(str_weatherKEY);
      var date = sessionStorage.getItem("last_call_API");
      date = JSON.stringify(date);
      if (date - Date.now() > 1000*60*10 || initialiser) { //si dernière actualisation vide ou obsolete
        date = JSON.stringify(Date.now("last_call_API"));
        initialiser = false;
        sessionStorage.setItem("last_call_API",date); //actualiser la date du doc
       
        for (let i = 0; i < data.voyages.length; i++) { //parcour de la liste des voyages car
          //forEach ... in ne fonctionne pas avec await
          const voyage = data.voyages[i];

          const temp = await temperature_API(voyage.latitude, voyage.longitude, weatherKEY); //appel de la fonction actualisation de températures

          data.voyages[i].temperature = temp;
  
        }
        const temperatures_aJour = JSON.stringify(data);
        sessionStorage.setItem("voyages", temperatures_aJour);

        actualiser_HTML(data);
      }
    })
    }
  

  async function temperature_API (lat,lon,APIkey) {
    return await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`) //appel API avec latitude et longitude du lieu
    .then(response => response.json())
    .then(data =>{
      const temperature = Math.round(data.main.temp -273.15); //convertion Kelvins en Celcius
      console.log("call de l'API");
      return temperature;
    });
  }
  
  function actualiser_HTML (data) {
    data.voyages.forEach(voyage => {
      const element = document.getElementById(`temperature-${voyage.id}`);
      element.innerText = `${voyage.temperature}°C`; //on affiche la température
    })
  }
}


fetch("../destinations/liste_Destinations.json")
.then(texte_brut => texte_brut.json())
.then(data => {
  const grille = document.getElementById("grid_cellules");
  data.voyages.forEach(voyage => {
    //creation du bloc cellule qui contient le lien vers la page reservation
    const a = document.createElement("a");
    a.id = voyage.id; //ajout de l'id avec le nom de la destination
    a.className = "cellule";
    a.href = `destination.html?id=${voyage.id}`;
    a.dataset.animaux = `${voyage.animaux}`;
    a.dataset.prix = `${voyage.prix}`;
    a.style.backgroundImage = `url(../destinations/${voyage.image1})`;
    
    //creation de la balise contenant le titre
    const p = document.createElement("p");
    p.textContent = `${voyage.ville}, ${voyage.pays}`;
    p.className = "titre";

    //creation de la balise affichant la temperature
    const p2 = document.createElement("p");
    p2.textContent = `${voyage.temperature}°C`;
    p2.id = `temperature-${voyage.id}`;
    p2.className = "temperature";

    //ajout des blocs créés
    a.appendChild(p);
    a.appendChild(p2);
    grille.appendChild(a);
  });

  get_temperature();
})
.catch(err => console.error("Erreur JSON :", err));

function filtreAnimaux (){
  for (dest of document.getElementById("grid_cellules").children) { //parcour de la liste des voyages
    if (dest.dataset.animaux === "non") { //verification de l'information stockee dans la balise
      dest.classList.toggle("filtre_animaux")
    }
  };
}

function filtrePrix (){
  const champ = document.getElementById("filtrePrix");
  let texte = champ.value; //récupérer la valeur contenue dans le champ
  for (dest of document.getElementById("grid_cellules").children) {  
    const prixMax = Number(texte);
    let prixVoyage = Number(dest.dataset.prix);
    if (prixMax < prixVoyage && prixMax > 0 ) { //compartion du prix avec le filtre
      dest.classList.add("filtre_prix"); //masquer le voyage
    }
    else {
      dest.classList.remove("filtre_prix"); //ré-afficher le voyage
    }
  } 
}