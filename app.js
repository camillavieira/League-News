document.getElementById('searchBtn').addEventListener('click', () => {
  const summonerName = document.getElementById('summonerName').value;
  const apiKey = 'SUA_API_KEY_AQUI';
  const region = 'br1';

  fetch(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('result').innerHTML = `
        <p><strong>Invocador:</strong> ${data.name}</p>
        <p><strong>Nível:</strong> ${data.summonerLevel}</p>
      `;
    })
    .catch(() => {
      document.getElementById('result').innerHTML = `<p>Jogador não encontrado 😢</p>`;
    });
});

navigator.geolocation.getCurrentPosition(
  (pos) => {
    const { latitude, longitude } = pos.coords;
    document.getElementById('local').textContent =
      `📍 Sua localização aproximada: ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
  },
  (err) => {
    document.getElementById('local').textContent =
      'Não foi possível acessar sua localização.';
  }
);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}