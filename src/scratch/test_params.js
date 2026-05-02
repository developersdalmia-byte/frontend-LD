
const API_URL = "https://api.lalitdalmia.com/api/v1";

async function testParams() {
  // We know the IDs from check_cats:
  // WOMENS WEAR: 69f4640107e32479633e9b11
  // LEHENGA: 69f4682007e32479633e9c68

  const tests = [
    `${API_URL}/products?category=69f4682007e32479633e9c68`, // Subcat ID in category param
    `${API_URL}/products?subcategory=69f4682007e32479633e9c68`, // Subcat ID in subcategory param
    `${API_URL}/products?category=69f4640107e32479633e9b11&subcategory=69f4682007e32479633e9c68`, // Both
  ];

  for (const url of tests) {
    try {
      const res = await fetch(url);
      const data = await res.json();
      const products = data.data?.products || [];
      console.log(`URL: ${url} | Count: ${products.length}`);
    } catch (err) {
      console.log(`URL: ${url} | FAILED`);
    }
  }
}

testParams();
