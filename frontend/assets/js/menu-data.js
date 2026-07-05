/*
 * Vasco da Gama Taverna — menu data
 * Source: Vasco Menu 2024 (https://vascos.co.za/menu/)
 * Prices in ZAR. This is demo data for the ordering prototype.
 */
const VASCO_MENU = [
  {
    category: "Starters",
    items: [
      { id: "st-beef-prego", name: "Beef Prego", price: 110, desc: "150g mature rump, pan-fried in Vasco's trinchado sauce." },
      { id: "st-chorizo", name: "Chorizo", price: 110, desc: "200g spicy smoked Portuguese sausage." },
      { id: "st-livers", name: "Chicken Livers", price: 89, desc: "200g prepared traditionally — a Vasco favourite." },
      { id: "st-chicken-prego", name: "Chicken Prego", price: 90, desc: "150g pan-fried chicken breast in Vasco's trinchado sauce." },
      { id: "st-wings", name: "Peri Peri Chicken Wings", price: 100, desc: "Flame-grilled and basted in our famous peri peri sauce." },
      { id: "st-beef-trinchado", name: "Beef Trinchado", price: 130, desc: "150g rump cubes, pan-fried in Vasco's trinchado sauce." },
      { id: "st-chicken-trinchado", name: "Chicken Trinchado", price: 92, desc: "150g chicken breast cubes, pan-fried in Vasco's trinchado sauce." },
      { id: "st-prawn-tails", name: "Cheesy Garlic Prawn Tails", price: 138, desc: "In a creamy garlic & cheese sauce with a toasted Portuguese roll." },
      { id: "st-calamari-strips", name: "Calamari Strips", price: 88, desc: "Grilled or fried, served with homemade tartar sauce." },
      { id: "st-calamari-tentacles", name: "Calamari Tentacles", price: 100, desc: "Fried and served with homemade tartar sauce." },
      { id: "st-mussel-pot", name: "Mussel Pot", price: 105, desc: "Mussels in the shell, served in a creamy garlic sauce." },
      { id: "st-poppers", name: "Portuguese Poppers", price: 94, desc: "Jalapeños stuffed with chorizo, cheddar & feta, creamy dipping sauce." },
      { id: "st-sardines", name: "Portuguese Sardines", price: 125, desc: "Three pan-grilled sardines with roasted peppers, red onion, parsley & garlic." },
      { id: "st-mushrooms", name: "Crumbed Mushrooms", price: 80, desc: "Deep-fried crumbed mushrooms, served with tartar sauce." }
    ]
  },
  {
    category: "Poultry Mains",
    note: "Served with chips, rice, baby potato or mash, salad or veg of the day.",
    items: [
      { id: "pm-strips", name: "Chicken Strips", price: 120, desc: "150g panko crumbed and deep fried until golden brown." },
      { id: "pm-trinchado", name: "Chicken Trinchado", price: 120, desc: "250g pan-fried chicken breast cubes with Vasco trinchado sauce." },
      { id: "pm-espetada", name: "Chicken Espetada", price: 180, desc: "350g skewered chicken breast with garlic butter." },
      { id: "pm-peri-half", name: "Vasco Peri Peri — Half", price: 150, desc: "Flame-grilled chicken, single portion." },
      { id: "pm-peri-whole", name: "Vasco Peri Peri — Whole", price: 280, desc: "Flame-grilled chicken, suitable for two sharing." },
      { id: "pm-peri-deboned", name: "Vasco Peri Peri — Deboned Half", price: 190, desc: "Flame-grilled chicken with a creamy peri peri sauce." }
    ]
  },
  {
    category: "Meat Mains",
    note: "Served with chips, rice, baby potato or mash, salad or veg of the day.",
    items: [
      { id: "mm-beef-trinchado", name: "Beef Trinchado", price: 205, desc: "200g rump cubes, pan-fried in Vasco's trinchado sauce." },
      { id: "mm-rump", name: "Rump Steak", price: 215, desc: "300g matured grilled rump. Add a sauce for R35." },
      { id: "mm-pepper-fillet", name: "Portuguese Pepper Fillet", price: 295, desc: "250g grilled & flambéed in brandy, served with pepper sauce." },
      { id: "mm-fillet", name: "Fillet", price: 275, desc: "250g succulent, tender fillet with our own homemade basting." },
      { id: "mm-espetada", name: "Espetada Grande", price: 245, desc: "350g basted rump, traditionally spiced on a skewer with garlic butter." },
      { id: "mm-portuguese-steak", name: "Vasco Portuguese Steak", price: 255, desc: "300g rump, trinchado sauce, chorizo & a fried egg on a sizzling plate." },
      { id: "mm-ribs", name: "Vasco Spare Ribs", price: 270, desc: "600g juicy tender pork ribs, prepared with our secret sauce." },
      { id: "mm-eisbein", name: "Eisbein", price: 222, desc: "Crispy pork, served with chips, mash or sauerkraut — a Vasco classic." },
      { id: "mm-bifinho", name: "Bifinho", price: 178, desc: "200g sirloin steak, topped with a fried egg and Vasco trinchado sauce." }
    ]
  },
  {
    category: "Seafood Mains",
    note: "Served with chips, rice, baby potato or mash, salad or veg of the day.",
    items: [
      { id: "sf-hake", name: "Hake", price: 178, desc: "Fried or grilled, served with homemade tartar sauce." },
      { id: "sf-calamari", name: "Calamari Strips", price: 165, desc: "250g fried calamari strips, served with homemade tartar sauce." },
      { id: "sf-snack-pan", name: "Seafood Snack Pan", price: 243, desc: "Tentacles, calamari strips and two prawns." },
      { id: "sf-platter", name: "Seafood Platter", price: 390, desc: "Grilled hake, prawns, mussels, calamari strips & tentacles. For two." },
      { id: "sf-prawns", name: "Vasco Prawns", price: 250, desc: "Six flame-grilled prawns — lemon & herb, peri peri, garlic or lemon butter." }
    ]
  },
  {
    category: "Combos",
    note: "Popular dishes to share. Served with chips, rice, baby potato or mash, salad or veg.",
    items: [
      { id: "cb-beef-cal", name: "Beef Trinchado & Calamari", price: 190, desc: "150g beef trinchado with 150g calamari strips." },
      { id: "cb-chicken-cal", name: "Chicken Trinchado & Calamari", price: 165, desc: "150g chicken trinchado with 150g calamari strips." },
      { id: "cb-hake-cal", name: "Hake & Calamari", price: 195, desc: "200g hake with 150g calamari strips." }
    ]
  },
  {
    category: "Lighter Grills",
    note: "Served with chips, rice, baby potato or mash, salad or veg of the day.",
    items: [
      { id: "lg-beef-prego", name: "Beef Prego", price: 145, desc: "150g mature rump, pan-fried in Vasco trinchado sauce." },
      { id: "lg-chicken-prego", name: "Chicken Prego", price: 100, desc: "150g pan-fried chicken breast in trinchado sauce on a Portuguese roll." },
      { id: "lg-steak-roll", name: "Steak Roll", price: 162, desc: "200g flame-grilled sirloin with BBQ basting on a Portuguese roll." },
      { id: "lg-vasco-burger", name: "Vasco Burger", price: 150, desc: "Beef patty, grilled chorizo, melted cheddar & Vasco onion rings." },
      { id: "lg-cheese-burger", name: "Cheese Burger", price: 120, desc: "Beef patty with melted cheddar and Vasco onion rings." },
      { id: "lg-chicken-burger", name: "Grilled Chicken Burger", price: 105, desc: "Chicken breast on a roll with Vasco onion rings." }
    ]
  },
  {
    category: "Vegetarian",
    note: "Served with chips, rice, baby potato or mash, salad or veg of the day.",
    items: [
      { id: "vg-burger", name: "Vasco Veggie Burger", price: 190, desc: "Spicy, flavour-packed burger without the meat." },
      { id: "vg-lasagne", name: "Vegetarian Lasagne", price: 155, desc: "Steamed veg on layers of pasta, smothered in creamy cheese sauce." },
      { id: "vg-moussaka", name: "Moussaka (GF)", price: 140, desc: "Slowly baked brinjals in a herbed cheese covering. Gluten free." }
    ]
  },
  {
    category: "Salads",
    items: [
      { id: "sl-portuguese", name: "Portuguese Salad", price: 70, desc: "Tomato, lettuce, cucumber, black olives and onion." },
      { id: "sl-greek", name: "Greek Salad", price: 90, desc: "Cucumber, red onion, tomato, black olives and feta." },
      { id: "sl-chicken", name: "Spicy Chicken Salad", price: 90, desc: "Spicy chicken, cucumber, red onion, tomato, lemon & olive oil." }
    ]
  },
  {
    category: "Sides",
    items: [
      { id: "sd-roll", name: "Portuguese Roll", price: 9, desc: "" },
      { id: "sd-sauce", name: "Sauce", price: 35, desc: "Mushroom, cheese, pepper or peri peri." },
      { id: "sd-chips-s", name: "Small Chips", price: 40, desc: "" },
      { id: "sd-chips-l", name: "Large Chips", price: 55, desc: "" },
      { id: "sd-veg", name: "Side Veg of the Day", price: 45, desc: "" },
      { id: "sd-spinach", name: "Spinach & Butternut", price: 45, desc: "" },
      { id: "sd-side-portuguese", name: "Portuguese Side Salad", price: 40, desc: "" },
      { id: "sd-side-greek", name: "Greek Side Salad", price: 60, desc: "" },
      { id: "sd-baby-potato", name: "Baby Potatoes", price: 42, desc: "" },
      { id: "sd-onion-rings", name: "Onion Rings", price: 38, desc: "" }
    ]
  },
  {
    category: "Desserts",
    items: [
      { id: "ds-nata", name: "Pasteis de Nata", price: 40, desc: "A Portuguese pastry delicacy with cinnamon." },
      { id: "ds-icecream", name: "Vanilla Ice-Cream & Chocolate Sauce", price: 60, desc: "" },
      { id: "ds-malva", name: "Malva Pudding", price: 60, desc: "Sweet sponge pudding served with ice cream or cream." },
      { id: "ds-cheesecake", name: "Baked Cheesecake", price: 72, desc: "Smooth cheesecake on a biscuit base with ice cream or cream." }
    ]
  },
  {
    category: "Milkshakes",
    items: [
      { id: "ms-chocolate", name: "Chocolate Milkshake", price: 45, desc: "" },
      { id: "ms-strawberry", name: "Strawberry Milkshake", price: 45, desc: "" },
      { id: "ms-vanilla", name: "Vanilla Milkshake", price: 45, desc: "" }
    ]
  },
  {
    category: "Drinks",
    items: [
      { id: "dr-water", name: "Still / Sparkling Water 500ml", price: 32, desc: "" },
      { id: "dr-coke", name: "Coca-Cola 300ml", price: 29, desc: "Coke, Coke No Sugar, Sprite, Fanta, Stoney, Crème Soda, Sparberry." },
      { id: "dr-appletiser", name: "Appletiser / Grapetiser", price: 43, desc: "" },
      { id: "dr-iced-tea", name: "Iced Tea", price: 35, desc: "Peach or lemon." },
      { id: "dr-redbull", name: "Red Bull", price: 43, desc: "Regular, Sugar Free or Watermelon." },
      { id: "dr-juice", name: "Fresh Fruit Juice", price: 45, desc: "Please ask for our seasonal selection." }
    ]
  },
  {
    category: "Hot Beverages",
    items: [
      { id: "hb-americano", name: "Americano", price: 32, desc: "" },
      { id: "hb-cappuccino", name: "Cappuccino", price: 35, desc: "" },
      { id: "hb-latte", name: "Café Latte", price: 35, desc: "" },
      { id: "hb-espresso", name: "Espresso", price: 22, desc: "Double R32." },
      { id: "hb-tea", name: "Tea", price: 30, desc: "" },
      { id: "hb-irish", name: "Jameson Irish Coffee", price: 65, desc: "Double R125." }
    ]
  }
];
