import mongoose from "mongoose";
import "dotenv/config";
import Product from "./models/product.model.js";
import User from "./models/user.model.js";

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce";

// Curated image pools with valid Unsplash high-res apparel images
const mensImages = [
  "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
];

const womensImages = [
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1610030469668-933d18c645fc?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=800&q=80",
];

const kidsImages = [
  "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1621452773781-0f992fd1f5c1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1471286174890-9c112ffca56a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&w=800&q=80",
];

// Product name generators for Indian fashion e-commerce
const mensTitles = [
  "Royal Embroidered Raw Silk Sherwani Set",
  "Classic Banarasi Brocade Nehru Jacket",
  "Handcrafted Chanderi Cotton Kurta Pyjama",
  "Designer Lucknowi Chikankari Men's Kurta",
  "Tailored Velvet Bandhgala Tuxedo Blazer",
  "Traditional Tussar Silk Festive Kurta",
  "Regal Jodhpuri Suit with Metallic Buttons",
  "Pure Linen Mandarin Collar Pathani Suit",
  "Printed Festive Jacquard Short Kurta",
  "Dobby Weave Formal Silk Kurta Shirt",
  "Handwoven Khadi Cotton Casual Kurta",
  "Asymmetric Angrakha Style Festive Kurta",
  "Zari Bordered Art Silk Dhoti Kurta Set",
  "Modern Mirror Work Evening Indo-Western",
  "Embossed Brocade Wedding Waistcoat",
  "Pastel Thread Embroidered Kurta Set",
  "Geometric Print Cotton Slub Kurta",
  "Heritage Zardosi Silk Wedding Sherwani",
  "Dual-Tone Dupion Silk Kurta Churidar",
  "Minimalist Solid Linen Blend Long Kurta",
  "Floral Motif Printed Summer Kurta",
  "Pleated Cowl Style Indo-Western Kurta",
  "Contemporary Bandhej Print Ethnic Shirt",
  "Stitch-Detailed Cotton Casual Kurta",
  "Embroidered Collar Silk Festive Kurta",
  "Gold Foil Printed Men's Festive Tunic",
  "Self-Design Textured Woolen Bandhgala",
  "Striped Handloom Khadi Short Kurta",
  "Fine Khadi Silk Ceremony Kurta Pyjama",
  "Rich Jamdani Woven Sherwani Jacket",
  "Printed Chiffon Stole with Silk Kurta",
  "Subtle Thread Work Linen Festive Kurta",
  "Monochrome Pintuck Cotton Men's Kurta",
  "Navy Blue Resham Embroidered Sherwani",
  "Maroon Velvet Festive Waistcoat",
  "Emerald Green Silk Kurta with Gold Piping",
  "Mustard Yellow Haldi Special Kurta",
  "Rose Gold Brocade Sangeet Sherwani",
  "Ivory Chikankari Wedding Kurta Set",
  "Charcoal Grey Textured Indo-Western Suit",
  "Wine Red Embroidered Bandhgala Coat",
  "Olive Green Handspun Cotton Kurta",
  "Peach Organza Embroidered Festive Kurta",
  "Sky Blue Casual Linen Mandarin Shirt",
  "Teal Green Silk Blend Kurta Churidar",
  "Beige Raw Silk Classic Achkan Set",
  "Burgundy Threadwork Festive Nehru Jacket",
  "Rust Orange Handloom Festive Kurta",
  "Copper Zari Woven Designer Sherwani",
  "Lavender Embroidered Modern Kurta",
  "Midnight Black Sequined Party Kurta",
  "Golden Katan Silk Regal Groom Kurta",
];

const womensTitles = [
  "Pure Banarasi Katan Silk Zari Saree",
  "Handwoven Kanjivaram Bridal Silk Saree",
  "Embellished Georgette Anarkali Gown",
  "Designer Floral Organza Festive Saree",
  "Velvet Zardozi Embroidered Bridal Lehenga",
  "Chanderi Silk Hand Block Printed Kurti",
  "Lucknowi Chikankari Georgette Sharara Set",
  "Mirror Work Bandhani Silk Traditional Saree",
  "Heavy Thread Embroidered Net Wedding Lehenga",
  "Pure Tussar Silk Saree with Temple Border",
  "Pastel Sequined Party Wear Anarkali Suit",
  "Banarasi Brocade Crop Top & Skirt Set",
  "Handloom Linen Saree with Jamdani Work",
  "Foil Print Chiffon Flowy Evening Saree",
  "Intricate Gota Patti Cotton Anarkali Set",
  "Digital Printed Crepe Silk Daily Saree",
  "Royal Paithani Silk Saree with Peacock Pallu",
  "Zari Woven Silk Blend Festive Salwar Suit",
  "Pleated Satin Designer Evening Saree",
  "Hand Embroidered Silk Straight Kurta Set",
  "Bandhej Georgette Ghagra Choli Set",
  "Pure Chiffon Floral Jaal Embroidered Saree",
  "Embossed Tissue Silk Festive Draped Saree",
  "Kashmiri Aari Work Georgette Kurta Set",
  "Flared Georgette Peplum Sharara Ensemble",
  "Patola Silk Traditional Double Ikkat Saree",
  "Threadwork Organza Dupatta with Silk Kurti",
  "Crushed Silk Tiered Festive Anarkali Gown",
  "Bridal Heritage Red Velvet Lehenga Choli",
  "Emerald Green Sequined Cocktail Saree",
  "Dusty Rose Embroidered Net Lehenga Set",
  "Mustard Yellow Mehndi Embroidered Kurti",
  "Royal Blue Banarasi Meenakari Silk Saree",
  "Turquoise Blue Chanderi Festive Suit",
  "Wine Purple Resham Threadwork Saree",
  "Ivory Pearl Embellished Organza Saree",
  "Maroon Heavy Zari Silk Bridal Saree",
  "Peach Floral Handloom Cotton Mulmul Saree",
  "Lavender Embroidered Georgette Palazzo Suit",
  "Mint Green Mirror Work Festive Kurti Set",
  "Teal Banarasi Katan Silk Heritage Saree",
  "Gold Shimmer Chiffon Red Carpet Saree",
  "Rani Pink Bandhani Silk Wedding Saree",
  "Magenta Silk Embroidered Anarkali Suit",
  "Sky Blue Hand Painted Organza Floral Saree",
  "Coral Orange Zari Buta Chanderi Kurti",
  "Plum Velvet Heavy Embroidered Kurti Set",
  "Champagne Gold Sequined Indo-Western Gown",
  "Sea Green Hand Block Print Chanderi Saree",
  "Yellow Haldi Special Silk Saree with Zari",
  "Black Georgette Chikankari Mirror Work Saree",
  "Ruby Red Raw Silk Handcrafted Festive Lehenga",
];

const kidsTitles = [
  "Boys Royal Jacquard Kurta Pyjama with Jacket",
  "Girls Embroidered Georgette Lehenga Choli",
  "Boys Traditional Silk Blend Dhoti Kurta Set",
  "Girls Pastel Sequined Festive Anarkali Suit",
  "Boys Brocade Bandhgala Suit for Weddings",
  "Girls Banarasi Silk Pattu Pavadai Set",
  "Boys Printed Cotton Casual Festive Kurta",
  "Girls Handcrafted Floral Organza Party Frock",
  "Boys Lucknowi Chikankari Festive Kurta",
  "Girls Gota Patti Embroidered Sharara Set",
  "Boys Nehru Jacket with Contrast Kurta Pyjama",
  "Girls Mirror Work Bandhani Ghagra Choli",
  "Boys Pathani Suit with Roll-Up Sleeves",
  "Girls Tiered Net Princess Gown with Bow",
  "Boys Asymmetric Hem Designer Kurta Set",
  "Girls Chanderi Silk Flared Kurti Palazzo",
  "Boys Velvet Embroidered Sherwani for Festivals",
  "Girls Ruffle Sleeve Floral Party Dress",
  "Boys Cotton Linen Comfort Kurta Churidar",
  "Girls Brocade Peplum Top with Dhoti Pants",
  "Boys Zari Embroidered Silk Kurta Pyjama",
  "Girls Foil Print Festive Kali Anarkali",
  "Boys Pastel Threadwork Haldi Kurta Set",
  "Girls Velvet Sequin Embroidered Lehenga",
  "Boys Striped Khadi Cotton Kurta Pyjama",
  "Girls Chiffon Dupatta with Embellished Suit",
  "Boys Modern Waistcoat Set with Bow Tie",
  "Girls Handloom Cotton Traditional Frock",
  "Boys Solid Silk Blend Kurta with Pocket Square",
  "Girls Mirror Work Kurti with Flared Skirt",
  "Boys Traditional Angrakha Dhoti Kurta Set",
  "Girls Shimmer Tulle Birthday Party Dress",
  "Boys Indo-Western Asymmetric Kurta Set",
  "Girls Bandhej Print Cotton Lehenga Choli",
  "Boys Embroidered Silk Kurta with Churidar",
  "Girls Floral Jacquard Festive Gown",
  "Boys Navy Blue Velvet Blazer with Kurta",
  "Girls Mustard Yellow Festive Sharara Suit",
  "Boys Emerald Green Silk Blend Kurta Set",
  "Girls Rani Pink Traditional Silk Pavadai",
  "Boys Maroon Brocade Nehru Jacket Set",
  "Girls Peach Sequined Floor Length Gown",
  "Boys Royal Blue Zari Border Kurta Dhoti",
  "Girls Sky Blue Chikankari Cotton Kurta Set",
  "Boys Teal Green Embroidered Festive Kurta",
  "Girls Lavender Net Ruffled Princess Frock",
  "Boys Wine Red Velvet Bandhgala Tuxedo",
  "Girls Coral Floral Embroidered Lehenga Set",
  "Boys Orange Haldi Special Cotton Kurta Set",
  "Girls Golden Tissue Silk Festive Lehenga",
  "Boys Classic White Cotton Kurta Pyjama",
  "Girls Red Velvet Festive Party Dress",
];

const adultSizes = ["S", "M", "L", "XL", "XXL"];
const kidsSizes = ["XS (4-5)", "S (6-7)", "M (8-9)", "L (10-12)", "XL (14-16)"];

const colorPalette = [
  ["#ff0000", "#ffd700", "#800000"],
  ["#000080", "#4169e1", "#ffffff"],
  ["#008000", "#2e8b57", "#ffd700"],
  ["#ff69b4", "#ba55d3", "#ffe4e1"],
  ["#ff8c00", "#ffd700", "#ffffff"],
  ["#800080", "#4b0082", "#dda0dd"],
  ["#000000", "#708090", "#c0c0c0"],
  ["#d2691e", "#8b4513", "#f5deb3"],
];

async function seed() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully to DB!");

    // Check or find user to assign products to
    let user = await User.findOne({ role: "admin" });
    if (!user) {
      user = await User.findOne();
    }
    if (!user) {
      console.log("Creating default admin user for product relations...");
      user = await User.create({
        name: "Admin Store",
        email: "admin@srmvastralaya.com",
        password: "AdminPassword123#",
        avatar: {
          public_id: "admin_avatar",
          url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        },
        role: "admin",
      });
    }

    console.log(`Using user ID: ${user._id} (${user.name})`);

    const productsToInsert = [];

    // 1. Generate Mens Products (52 items)
    mensTitles.forEach((title, idx) => {
      const img1 = mensImages[idx % mensImages.length];
      const img2 = mensImages[(idx + 1) % mensImages.length];
      const price = 899 + (idx % 15) * 280;
      const rating = Number((4.0 + (idx % 10) * 0.1).toFixed(1));
      const numOfReviews = 10 + (idx * 3) % 45;
      const isFeatured = idx % 4 === 0;

      productsToInsert.push({
        name: title,
        description: `Exquisitely crafted ${title.toLowerCase()} made from premium textiles. Designed with intricate detailing, comfortable drape, and unmatched craftsmanship. Perfect for weddings, festive occasions, ceremonies, and cultural gatherings. Dry clean recommended for long-lasting sheen.`,
        price,
        category: "mens",
        stock: 25 + (idx % 20),
        ratings: rating,
        numOfReviews,
        isFeatured,
        sizes: adultSizes,
        colors: colorPalette[idx % colorPalette.length],
        images: [
          { url: img1, public_id: `seed_mens_${idx}_1` },
          { url: img2, public_id: `seed_mens_${idx}_2` },
        ],
        user: user._id,
      });
    });

    // 2. Generate Womens Products (52 items)
    womensTitles.forEach((title, idx) => {
      const img1 = womensImages[idx % womensImages.length];
      const img2 = womensImages[(idx + 1) % womensImages.length];
      const price = 1199 + (idx % 18) * 350;
      const rating = Number((4.2 + (idx % 8) * 0.1).toFixed(1));
      const numOfReviews = 12 + (idx * 4) % 50;
      const isFeatured = idx % 4 === 0;

      productsToInsert.push({
        name: title,
        description: `Stunning ${title.toLowerCase()} radiating timeless elegance and rich heritage. Woven with master artisan finesse, radiant zari work, and flattering silhouette. Ideal for celebratory bridal events, festive pujas, and traditional occasions. Handcrafted luxury by Shree RamJanki Vastralaya.`,
        price,
        category: "womens",
        stock: 20 + (idx % 25),
        ratings: rating,
        numOfReviews,
        isFeatured,
        sizes: adultSizes,
        colors: colorPalette[(idx + 2) % colorPalette.length],
        images: [
          { url: img1, public_id: `seed_womens_${idx}_1` },
          { url: img2, public_id: `seed_womens_${idx}_2` },
        ],
        user: user._id,
      });
    });

    // 3. Generate Kids Products (52 items)
    kidsTitles.forEach((title, idx) => {
      const img1 = kidsImages[idx % kidsImages.length];
      const img2 = kidsImages[(idx + 1) % kidsImages.length];
      const price = 699 + (idx % 12) * 220;
      const rating = Number((4.1 + (idx % 9) * 0.1).toFixed(1));
      const numOfReviews = 8 + (idx * 3) % 40;
      const isFeatured = idx % 4 === 0;

      productsToInsert.push({
        name: title,
        description: `Delightful ${title.toLowerCase()} crafted with skin-friendly, breathable fabric for children. Features vibrant festive hues, soft inner lining for tender comfort, and easy wearability. Designed for family weddings, festivals, and cultural celebrations.`,
        price,
        category: "kids",
        stock: 30 + (idx % 15),
        ratings: rating,
        numOfReviews,
        isFeatured,
        sizes: kidsSizes,
        colors: colorPalette[(idx + 4) % colorPalette.length],
        images: [
          { url: img1, public_id: `seed_kids_${idx}_1` },
          { url: img2, public_id: `seed_kids_${idx}_2` },
        ],
        user: user._id,
      });
    });

    console.log(
      `Prepared ${productsToInsert.length} total products (${mensTitles.length} mens, ${womensTitles.length} womens, ${kidsTitles.length} kids).`
    );

    // Insert all products
    console.log("Inserting products into database...");
    const inserted = await Product.insertMany(productsToInsert);
    console.log(`Successfully inserted ${inserted.length} products!`);

    // Category summary count
    const mensCount = await Product.countDocuments({ category: "mens" });
    const womensCount = await Product.countDocuments({ category: "womens" });
    const kidsCount = await Product.countDocuments({ category: "kids" });
    const totalCount = await Product.countDocuments();

    console.log("-----------------------------------------");
    console.log("Current Database Product Count:");
    console.log(`- Mens:   ${mensCount} products`);
    console.log(`- Womens: ${womensCount} products`);
    console.log(`- Kids:   ${kidsCount} products`);
    console.log(`- Total:  ${totalCount} products`);
    console.log("-----------------------------------------");

    await mongoose.disconnect();
    console.log("Database disconnected. Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error during seeding:", err);
    process.exit(1);
  }
}

seed();
