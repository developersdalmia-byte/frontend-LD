
const API_URL = "https://api.lalitdalmia.com/api/v1";

async function fetchAndLog(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(`URL: ${url}`);
    // Check various common data structures
    const products = data.products || data.items || data.data || (Array.isArray(data) ? data : []);
    console.log(` - Success: ${data.success}`);
    console.log(` - Count: ${products.length}`);
    if (products.length > 0) {
      const p = products[0];
      console.log(` - Sample: ${p.title} | Cat: ${p.category} | Sub: ${p.subcategory}`);
    }
  } catch (err) {
    console.log(`URL: ${url} - FAILED: ${err.message}`);
  }
}

async function run() {
  await fetchAndLog(`${API_URL}/products?limit=5`);
  await fetchAndLog(`${API_URL}/products?category=womens-wear&limit=5`);
  await fetchAndLog(`${API_URL}/products?subcategory=lehenga&limit=5`);
  await fetchAndLog(`${API_URL}/products?category=lehenga&limit=5`);
}

run();
