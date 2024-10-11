// Search-knappen
const searchInputWrapper = document.querySelector(".search-input-wrapper");
const searchInput = document.querySelector(".search-input input");
const allMonsters = document.querySelector(".see-all");
const searchIcon = document.querySelector(".search-icon i");
const closeIcon = document.querySelector(".search-input i");
const selectType = document.querySelector("#type");
const selectColor = document.querySelector("#color");

searchIcon.addEventListener("click", () => {
  searchIcon.parentElement.classList.add("change");
  searchInputWrapper.classList.add("change");

  setTimeout(() => {
    searchInput.focus();
  }, 300); // Kortare timeout för snabbare användarrespons
});

closeIcon.addEventListener("click", () => {
  searchIcon.parentElement.classList.remove("change");
  searchInputWrapper.classList.remove("change");
  searchInput.value = ""; // Rensar sökfältet när det stängs
});

// DOM för att hämta data till formulär
document.addEventListener("DOMContentLoaded", () => {
  const monsterForm = document.querySelector("#monsterForm"); // Formuläret
  const submitButton = document.querySelector(
    "#monsterForm button[type='submit']"
  ); // Knapppen som skapar ett monster
  const monsterList = document.querySelector(".monster-container"); // Div-taggen som visar alla monster
  const numberOfMonsters = document.querySelector("#number-of-monsters"); // Span-taggen som visar antal monster i listan
  const monsterHeader = document.querySelector("#monster-header"); // H2-elementet

  // Tom lista för att lagra alla monster
  let monsters = [];
  const monsterType = ["water", "fire", "earth"];
  const monsterColor = ["blue", "green", "red", "white", "black"];

  for (type of monsterType) {
    const getmonsterType = document.createElement("option");
    getmonsterType.innerHTML = type;
    getmonsterType.value = type;
    selectType.appendChild(getmonsterType);
  }

  for (color of monsterColor) {
    const getmonsterColor = document.createElement("option");
    getmonsterColor.innerHTML = color;
    getmonsterColor.value = color;
    selectColor.appendChild(getmonsterColor);
  }

  // Lyssna på formulärets submit-knapp
  monsterForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Skapar ett monster-objekt med olika egenskaper
    const name = monsterForm.name.value;
    const type = monsterForm.type.value;
    const color = monsterForm.color.value;

    const tentacles = monsterForm.tentacles.value;
    const eyes = monsterForm.eyes.value;
    const horn = monsterForm.horn.value;
    const ears = monsterForm.ears.value;

    // Skapar en editIndex om det finns ett monster att redigera
    const editIndex = monsterForm.getAttribute("data-edit-index");

    // Uppdatera ett befintligt monster
    if (editIndex !== null) {
      monsters[editIndex] = {
        name,
        type,
        color,
        tentacles,
        eyes,
        horn,
        ears,
      };
      monsterForm.removeAttribute("data-edit-index");
      submitButton.textContent = "Add Monster";
    } else {
      // Lägg till ett nytt monster
      const newMonster = {
        name,
        type,
        color,
        tentacles,
        eyes,
        horn,
        ears,
      };
      monsters.push(newMonster);
    }

    // Visa H2-rubriken när minst ett monster har skapats
    if (monsters.length > 0) {
      monsterHeader.style.display = "block"; // Gör H2 synlig
    } else {
      monsterHeader.style.display = "none"; // Gör H2 osynlig
    }

    // Uppdatera listan med alla monster
    updateMonsterList(monsters);
    monsterForm.reset();
    numberOfMonsters.textContent = `Number of monsters: ${monsters.length}`;
  });

  // Funktion för att uppdatera DOM med alla monster
  function updateMonsterList(monstersToShow) {
    monsterList.innerHTML = ""; // Rensar monsterlistan
    monstersToShow.forEach((monster, index) => {
      const monsterDiv = document.createElement("div");
      monsterDiv.classList.add("monster-box");
      monsterDiv.style.backgroundColor = monster.color;
      monsterDiv.innerHTML = `
        <p><strong>Name:</strong> ${monster.name}</p>
        <p><strong>Type:</strong>${monster.type}</p>
        <p><strong>Color:</strong>${monster.color}</p>
        <p><strong>Tentacles:</strong> ${monster.tentacles}</p>
        <p><strong>Eyes:</strong> ${monster.eyes}</p>
        <p><strong>Horn:</strong> ${monster.horn}</p>
        <p><strong>Ears:</strong> ${monster.ears}</p>
        <button class="edit" data-index="${index}">Edit</button>
        <button class="delete" data-index="${index}">Remove</button>
      `;
      let reZise = document.createElement("button");
      reZise.appendChild(document.createTextNode("STOR"));
      reZise.setAttribute("class", "btnReZise");
      monsterDiv.appendChild(reZise);
      function bigStyle() {
        monsterDiv.classList.remove("monster-box");
        monsterDiv.style.backgroundColor = "none";
        monsterDiv.classList.add("reZise");
      }
      reZise.addEventListener("click", bigStyle);
      monsterList.appendChild(monsterDiv);
    });

    // Lägg till lyssnare för edit- och delete-knappar
    document.querySelectorAll(".edit").forEach((button) => {
      button.addEventListener("click", (event) => {
        const indexEdit = event.target.getAttribute("data-index");
        loadMonsterIntoForm(indexEdit);
      });
    });

    document.querySelectorAll(".delete").forEach((button) => {
      button.addEventListener("click", (event) => {
        const indexDelete = event.target.getAttribute("data-index");
        deleteMonster(indexDelete);
      });
    });

    numberOfMonsters.textContent = `Number of monsters: ${monstersToShow.length}`;
  }

  // Funktion för att fylla formuläret med monsterdata vid redigering
  function loadMonsterIntoForm(index) {
    const monster = monsters[index];
    document.getElementById("name").value = monster.name;
    selectType.value = monster.type;
    selectType.value = monster.color;
    document.getElementById("tentacles").value = monster.tentacles;
    document.getElementById("eyes").value = monster.eyes;
    document.getElementById("horn").value = monster.horn;
    document.getElementById("ears").value = monster.ears;

    monsterForm.setAttribute("data-edit-index", index);
    submitButton.textContent = "Save Changes";
  }

  // Funktion för att ta bort ett monster från listan
  function deleteMonster(index) {
    monsters.splice(index, 1);
    updateMonsterList(monsters);

    // Göm H2-rubriken om alla monster tas bort
    if (monsters.length === 0) {
      monsterHeader.style.display = "none";
    }
  }

  // Funktion för att söka efter monster
  function searchMonsters() {
    const searchInputValue = searchInput.value.toLowerCase(); // Hämtar sökvärdet
    const filteredMonsters = monsters.filter((monster) => {
      return (
        monster.name.toLowerCase().includes(searchInputValue) ||
        monster.type.toLowerCase().includes(searchInputValue) ||
        monster.color.toLowerCase().includes(searchInputValue)
      );
    });

    updateMonsterList(filteredMonsters);
    searchInput.value = ""; // Rensa sökfältet efter sökning
  }

 
  allMonsters.addEventListener("click", (e) => {
    e.preventDefault();
    monsterList.innerHTML = ''
  });

  // Lägg till event listener för sökknappen
  document
    .getElementById("search-button")
    .addEventListener("click", (event) => {
      event.preventDefault();
      searchMonsters();
    });

  // Lägg till event listener för Enter-tangenten i sökrutan
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      searchMonsters();
    }
  });
});
