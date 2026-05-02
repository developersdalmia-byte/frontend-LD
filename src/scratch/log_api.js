
const API_URL = "https://api.lalitdalmia.com/api/v1";

async function run() {
  const response = await fetch(`${API_URL}/products?limit=1`);
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

run();
