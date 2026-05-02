
const API_URL = "https://api.lalitdalmia.com/api/v1";

async function checkSubcategories() {
  const tests = [
    "/products?search=Lehenga",
    "/products?category=lehenga",
    "/products?subcategory=lehenga",
    "/products?category=womens-wear&subcategory=lehenga",
    "/products?q=Lehenga"
  ];

  for (const t of tests) {
    try {
      const response = await fetch(`${API_URL}${t}`);
      const data = await response.json();
      const products = data.products || data.items || (Array.isArray(data) ? data : []);
      console.log(`Test [${t}]: Found ${products.length} products`);
      if (products.length > 0) {
        console.log(` - First Product: ${products[0].title}, Cat: ${products[0].category}, Sub: ${products[0].subcategory}`);
      }
    } catch (err) {
      console.log(`Test [${t}]: FAILED`);
    }
  }
}

checkSubcategories();
