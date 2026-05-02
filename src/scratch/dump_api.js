
const API_URL = "https://api.lalitdalmia.com/api/v1";

async function dumpProducts() {
  try {
    const response = await fetch(`${API_URL}/products?limit=100`);
    const data = await response.json();
    const products = data.products || data.items || (Array.isArray(data) ? data : []);
    console.log(`Total products: ${products.length}`);
    
    const categories = new Set();
    const subcategories = new Set();
    
    products.forEach(p => {
      if (p.category) categories.add(p.category);
      if (p.subcategory) subcategories.add(p.subcategory);
    });
    
    console.log("Found Categories:", Array.from(categories));
    console.log("Found Subcategories:", Array.from(subcategories));
  } catch (err) {
    console.log("DUMP FAILED", err);
  }
}

dumpProducts();
