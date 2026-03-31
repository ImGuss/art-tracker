import pool from './db.js'

async function seedTags() {
  const tags = [
    // Medium / Material
    "Oil", "Watercolor", "Acrylic", "Tempera", "Gouache", "Fresco", "Encaustic", "Pastel", "Charcoal", "Graphite", "Ink", "Pencil", "Chalk", "Crayon", "Wax", "Enamel", "Mosaic", "Lacquer",
    // Format / Discipline
    "Painting", "Drawing", "Sculpture", "Print", "Photograph", "Textile", "Tapestry", "Ceramic", "Pottery", "Glassware", "Jewelry", "Furniture", "Metalwork", "Woodwork", "Ivory", "Embroidery", "Collage", "Installation", "Video", "Performance",
    // Support / Surface
    "Canvas", "Paper", "Wood", "Panel", "Parchment", "Vellum", "Silk", "Linen", "Stone", "Marble", "Bronze", "Copper", "Silver", "Gold", "Terracotta", "Porcelain", "Alabaster",
    // Print Techniques
    "Etching", "Engraving", "Lithograph", "Woodcut", "Aquatint", "Screenprint", "Mezzotint", "Linocut", "Monotype",
    // Photographic Processes
    "Albumen Print", "Gelatin Silver Print", "Daguerreotype", "Cyanotype", "Platinum Print", "Chromogenic Print",
    // Subject Matter
    "Portrait", "Landscape", "Still Life", "Figure", "Nude", "Mythology", "Religion", "History", "Genre Scene", "Animal", "Botanical", "Architectural", "Abstract", "Cityscape", "Seascape", "Battle Scene", "Allegory",
    // Style / Movement
    "Impressionism", "Post-Impressionism", "Expressionism", "Surrealism", "Cubism", "Baroque", "Renaissance", "Romanticism", "Realism", "Modernism", "Minimalism", "Abstract Expressionism", "Art Nouveau", "Art Deco", "Neoclassicism", "Symbolism", "Fauvism", "Dadaism", "Pop Art",
    // Region / Culture
    "African", "American", "Ancient Egyptian", "Ancient Greek", "Ancient Roman", "Asian", "Byzantine", "Chinese", "Dutch", "Flemish", "French", "Indian", "Islamic", "Italian", "Japanese", "Korean", "Medieval", "Mesoamerican", "Oceanic", "Spanish",
    // Period
    "Ancient", "Medieval", "Early Modern", "17th Century", "18th Century", "19th Century", "20th Century", "Contemporary",
    // Function / Type
    "Decorative Arts", "Religious Art", "Folk Art", "Applied Arts", "Manuscript", "Armor", "Weapon", "Coin", "Medal", "Cameo", "Miniature", "Altarpiece", "Icon", "Reliquary"
  ]

  const uniqueTags = [...new Set(tags)]

  try {
    const placeholders = []

    for (let i = 1; i <= uniqueTags.length; i++) {
      placeholders.push(
        `($${ i })`
      )
    }

    await pool.query(
      `
        INSERT INTO tags (name)
        VALUES ${placeholders.join(',')}
        ON CONFLICT (name) DO NOTHING
      `, uniqueTags
    )

    console.log(`Seeded ${uniqueTags.length} tags`)

  } catch (err) {
    console.error('Error in adding to database', err) 
  } finally {
    pool.end()
  }
}

seedTags()