
const API_URL = "https://api.lalitdalmia.com/api/v1";

async function checkSubcategories() {
  try {
    const response = await fetch(`${API_URL}/products?search=Lehenga&limit=10`);
    const data = await response.json();
    
    const products = data.products || data.items || [];
    console.log(`Found ${products.length} products for search 'Lehenga'`);
    
    products.forEach(p => {
      console.log(`Product: ${p.title}`);
      console.log(` - Category: ${p.category}`);
      console.log(` - Subcategory: ${p.subcategory}`);
      console.log(` - Attributes:`, p.attributes);
      console.log('---');
    });
  } catch (err) {
    console.error("Error fetching products:", err);
  }
}

checkSubcategories();
