const dotenv = require('dotenv');
const { pool } = require('./src/config/db');
const fs = require('fs');
const path = require('path');

dotenv.config();

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

const menuItems = [
    {
        name: "Classic Cheeseburger",
        description: "Juicy beef patty with cheddar cheese, lettuce, tomato, and our secret sauce.",
        price: 12.99,
        category: "Burgers",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "Truffle Mushroom Burger",
        description: "Beef patty topped with sautéed wild mushrooms, swiss cheese, and truffle mayo.",
        price: 15.99,
        category: "Burgers",
        image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "Crispy Chicken Sandwich",
        description: "Fried chicken breast with pickles and spicy coleslaw on a brioche bun.",
        price: 13.50,
        category: "Sandwiches",
        image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "Margherita Pizza",
        description: "Classic tomato sauce, fresh mozzarella, and aromatic basil leaves.",
        price: 14.00,
        category: "Pizza",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "Pepperoni Passion",
        description: "Loaded with double pepperoni and extra cheese for meat lovers.",
        price: 16.50,
        category: "Pizza",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "Vegetarian Facewich",
        description: "Grilled zucchini, eggplant, roasted peppers, and pesto on focaccia.",
        price: 11.99,
        category: "Sandwiches",
        image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "Caesar Salad",
        description: "Crisp romaine lettuce, parmesan cheese, croutons, and Caesar dressing.",
        price: 10.99,
        category: "Salads",
        image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "Greek Salad",
        description: "Tomatoes, cucumbers, olives, feta cheese, and olive oil dressing.",
        price: 11.50,
        category: "Salads",
        image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "Spaghetti Carbonara",
        description: "Traditional Italian pasta with egg, cheese, pancetta, and black pepper.",
        price: 16.99,
        category: "Pasta",
        image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "Penne Arrabbiata",
        description: "Pasta in a spicy tomato sauce with garlic and dried red chili peppers.",
        price: 14.99,
        category: "Pasta",
        image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "Grilled Salmon",
        description: "Fresh Atlantic salmon grilled to perfection, served with asparagus.",
        price: 22.00,
        category: "Main",
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "Ribeye Steak",
        description: "Premium cut steak cooked to your liking, served with mashed potatoes.",
        price: 28.50,
        category: "Main",
        image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "Chocolate Lava Cake",
        description: "Warm chocolate cake with a gooey center, served with vanilla ice cream.",
        price: 8.99,
        category: "Dessert",
        image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "Tiramisu",
        description: "Coffee-flavoured Italian dessert. Ladyfingers dipped in coffee, layered with mascarpone.",
        price: 9.50,
        category: "Dessert",
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "Fresh Lemonade",
        description: "Homemade lemonade with fresh lemons and mint.",
        price: 4.50,
        category: "Drinks",
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
];

const seedDB = async () => {
    try {
        console.log('Connecting to PostgreSQL...');
        
        // Create tables first
        const schemaPath = path.join(__dirname, 'src', 'models', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await pool.query(schema);
        console.log('Database schema created/updated');

        // Clear existing menu items
        await pool.query('DELETE FROM menu_items');
        console.log('Cleared existing menu items');

        // Insert menu items
        for (const item of menuItems) {
            await pool.query(
                'INSERT INTO menu_items (name, description, price, category, image, available) VALUES ($1, $2, $3, $4, $5, $6)',
                [item.name, item.description, item.price, item.category, item.image, true]
            );
        }
        
        console.log('Added 15 menu items');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
