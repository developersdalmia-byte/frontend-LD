
const API_URL = "https://api.lalitdalmia.com/api/v1";

async function checkCats() {
  try {
    const response = await fetch(`${API_URL}/categories`);
    const data = await response.json();
    const categories = Array.isArray(data) ? data : (data.data ?? []);
    console.log("Categories found:", categories.length);
    categories.forEach(c => {
      console.log(`- Category: ${c.name} (Slug: ${c.slug})`);
      if (c.subcategories) {
        c.subcategories.forEach(s => {
          console.log(`  -- Subcategory: ${s.name} (Slug: ${s.slug})`);
        });
      }
    });
  } catch (err) {
    console.log("CAT CHECK FAILED", err);
  }
}

checkCats();
