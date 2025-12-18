const { sequelize, Category, MenuItem } = require('../models');

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // Reset database
    console.log('Database synced.');

    // Create Categories
    const categories = await Category.bulkCreate([
      { name: 'Fried Chicken' },
      { name: 'Sides' },
      { name: 'Seafood' },
      { name: 'Drinks' },
      { name: 'Desserts' }
    ]);

    const [chicken, sides, seafood, drinks, desserts] = categories;

    // Create Menu Items
    await MenuItem.bulkCreate([
      {
        name: 'Classic Fried Chicken',
        description: 'Golden, crispy, and juicy fried chicken seasoned to perfection.',
        price: 12.99,
        imageUrl: 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        CategoryId: chicken.id
      },
      {
        name: 'Spicy Fried Chicken',
        description: 'Our classic fried chicken with a spicy kick of cayenne and paprika.',
        price: 13.99,
        imageUrl: 'https://images.pexels.com/photos/1352270/pexels-photo-1352270.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        CategoryId: chicken.id
      },
      {
        name: 'Chicken Tenders',
        description: 'Hand-breaded chicken tenders served with your choice of dipping sauce.',
        price: 10.99,
        imageUrl: 'https://images.pexels.com/photos/2955819/pexels-photo-2955819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        CategoryId: chicken.id
      },
      {
        name: 'Southern Mac & Cheese',
        description: 'Creamy, baked macaroni and cheese with a three-cheese blend.',
        price: 5.99,
        imageUrl: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        CategoryId: sides.id
      },
      {
        name: 'Collard Greens',
        description: 'Slow-cooked collard greens with smoked turkey leg.',
        price: 4.99,
        imageUrl: 'https://images.pexels.com/photos/2092906/pexels-photo-2092906.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        CategoryId: sides.id
      },
      {
        name: 'Mashed Potatoes',
        description: 'Buttery mashed potatoes topped with savory gravy.',
        price: 4.99,
        imageUrl: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        CategoryId: sides.id
      },
      {
        name: 'Cornbread',
        description: 'Sweet and moist homemade cornbread muffins.',
        price: 3.99,
        imageUrl: 'https://images.pexels.com/photos/3590401/pexels-photo-3590401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        CategoryId: sides.id
      },
      {
        name: 'Shrimp & Grits',
        description: 'Sautéed shrimp served over creamy cheese grits with bacon.',
        price: 16.99,
        imageUrl: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        CategoryId: seafood.id
      },
      {
        name: 'Fried Catfish',
        description: 'Cornmeal-crusted catfish fillets fried until golden brown.',
        price: 15.99,
        imageUrl: 'https://images.pexels.com/photos/3659862/pexels-photo-3659862.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        CategoryId: seafood.id
      },
      {
        name: 'Sweet Tea',
        description: 'Classic Southern sweet iced tea.',
        price: 2.99,
        imageUrl: 'https://images.pexels.com/photos/5946633/pexels-photo-5946633.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        CategoryId: drinks.id
      },
      {
        name: 'Homemade Lemonade',
        description: 'Freshly squeezed lemonade, perfectly sweet and tart.',
        price: 3.49,
        imageUrl: 'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        CategoryId: drinks.id
      },
      {
        name: 'Peach Cobbler',
        description: 'Warm peach cobbler with a flaky crust, served with vanilla ice cream.',
        price: 6.99,
        imageUrl: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        CategoryId: desserts.id
      },
      {
        name: 'Banana Pudding',
        description: 'Layers of vanilla wafers, fresh bananas, and creamy pudding.',
        price: 5.99,
        imageUrl: 'https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        CategoryId: desserts.id
      },
      {
        name: 'Red Beans & Rice',
        description: 'Smoky red beans simmered with spices and served over white rice.',
        price: 8.99,
        imageUrl: 'https://images.pexels.com/photos/3926123/pexels-photo-3926123.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        CategoryId: sides.id
      },
      {
        name: 'Biscuits & Gravy',
        description: 'Fluffy buttermilk biscuits smothered in sausage gravy.',
        price: 7.99,
        imageUrl: 'https://images.pexels.com/photos/5737254/pexels-photo-5737254.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        CategoryId: sides.id
      }
    ]);

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();