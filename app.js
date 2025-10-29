// URL do proxy gratuito (resolve problema de CORS)
const proxyURL = "https://cors-anywhere.herokuapp.com/";

// Chave da API da Riot (substitua pela sua)
const RIOT_API_KEY = "SUA_CHAVE_DE_API";

// Elementos do DOM
const searchForm = document.getElementById("searchForm");
const summonerInput = document.getElementById("summonerName");
const summonerInfo = document.getElementById("summonerInfo");
const championsContainer = document.getElementById("championsContainer");

// Função para buscar invocador
async function getSummoner(name) {
  try {
    const response = await fetch(
      `${proxyURL}https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${RIOT_API_KEY}`
    );
    if (!response.ok) throw new Error("Invocador não encontrado");
    const data = await response.json();
    return data;
  } catch (error) {
    alert(error.message);
    return null;
  }
}

// Função para mostrar informações do invocador
function displaySummoner(data) {
  summonerInfo.innerHTML = `
    <h2>${data.name}</h2>
    <p>Nível: ${data.summonerLevel}</p>
  `;
}

// Função para carregar campeões do Data Dragon
async function loadChampions() {
  try {
    // Pega a versão mais recente do Data Dragon
    const versionRes = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
    const versions = await versionRes.json();
    const latestVersion = versions[0];

    // Pega os dados de todos os campeões
    const champsRes = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/pt_BR/champion.json`
    );
    const champsData = await champsRes.json();

    championsContainer.innerHTML = "";

    for (let champKey in champsData.data) {
      const champ = champsData.data[champKey];
      const imgURL = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${champ.image.full}`;
      const champDiv = document.createElement("div");
      champDiv.classList.add("champion");
      champDiv.innerHTML = `
        <img src="${imgURL}" alt="${champ.name}" />
        <p>${champ.name}</p>
      `;
      championsContainer.appendChild(champDiv);
    }
  } catch (error) {
    console.error("Erro ao carregar campeões:", error);
  }
}

// Evento do formulário
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = summonerInput.value.trim();
  if (!name) return;

  const summonerData = await getSummoner(name);
  if (summonerData) displaySummoner(summonerData);
});

// Carrega campeões ao iniciar
loadChampions();
