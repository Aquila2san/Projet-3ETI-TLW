async function getData() {
  const url = "../destinations/liste_Destinations.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
  }catch (error) {
    console.error(error.message);
  }
}

function CHARGER_Destinations() {
  const grille = document.querySelector("section");
  const cellule = document.createElement("div");
  cellule.createElement("")
  
}