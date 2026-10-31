require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

const products = [
  {
    name: 'Wireless Noise Cancelling Headphones',
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio quality. Perfect for music lovers and professionals.',
    price: 299.99,
    category: 'electronics',
    stock: 50,
    rating: 4.8,
    numReviews: 234,
    featured: true,
    brand: 'AudioTech',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500']
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracker with heart rate monitoring, GPS, sleep tracking, and 7-day battery life. Water-resistant up to 50 meters.',
    price: 199.99,
    category: 'electronics',
    stock: 75,
    rating: 4.6,
    numReviews: 189,
    featured: true,
    brand: 'FitPro',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500']
  },
  {
    name: 'Premium Cotton T-Shirt',
    description: 'Ultra-soft 100% organic cotton t-shirt. Available in multiple colors. Breathable and comfortable for everyday wear.',
    price: 34.99,
    category: 'clothing',
    stock: 200,
    rating: 4.5,
    numReviews: 456,
    featured: true,
    brand: 'EcoWear',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500']
  },
  {
    name: 'Minimalist Desk Lamp',
    description: 'Modern LED desk lamp with adjustable brightness, color temperature control, and wireless phone charging base.',
    price: 79.99,
    category: 'home',
    stock: 60,
    rating: 4.7,
    numReviews: 123,
    featured: true,
    brand: 'LightDesign',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=500']
  },
  {
    name: 'Professional Running Shoes',
    description: 'Lightweight running shoes with responsive cushioning and breathable mesh upper. Ideal for daily training and marathons.',
    price: 129.99,
    category: 'sports',
    stock: 100,
    rating: 4.9,
    numReviews: 312,
    featured: true,
    brand: 'RunMax',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500']
  },
  {
    name: 'Bestselling Novel Collection',
    description: 'Collection of 3 award-winning contemporary novels. Beautifully bound hardcover editions with author signatures.',
    price: 49.99,
    category: 'books',
    stock: 45,
    rating: 4.8,
    numReviews: 89,
    featured: false,
    brand: 'BookHouse',
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500']
  },
  {
    name: 'Building Blocks Mega Set',
    description: '1000-piece building blocks set with instruction manual. Compatible with all major brands. Great for kids and adults.',
    price: 59.99,
    category: 'toys',
    stock: 80,
    rating: 4.7,
    numReviews: 567,
    featured: true,
    brand: 'BlockMaster',
    images: ['https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=500']
  },
  {
    name: 'Smart Home Speaker',
    description: 'Voice-controlled smart speaker with premium 360-degree sound. Built-in assistant, multi-room audio, and smart home control.',
    price: 149.99,
    category: 'electronics',
    stock: 90,
    rating: 4.4,
    numReviews: 278,
    featured: false,
    brand: 'SoundHub',
    images: ['https://images.unsplash.com/photo-1543512214-318c7553f230?w=500']
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Fully adjustable ergonomic chair with lumbar support, breathable mesh, and 4D armrests. Designed for 8+ hour comfort.',
    price: 449.99,
    category: 'home',
    stock: 30,
    rating: 4.9,
    numReviews: 156,
    featured: true,
    brand: 'ComfortZone',
    images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500']
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Non-slip yoga mat with alignment guides. Extra thick 6mm cushioning for joint protection. Eco-friendly TPE material.',
    price: 44.99,
    category: 'sports',
    stock: 120,
    rating: 4.6,
    numReviews: 345,
    featured: false,
    brand: 'ZenFit',
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500']
  },
  {
    name: 'Leather Crossbody Bag',
    description: 'Genuine leather crossbody bag with adjustable strap. Multiple compartments for organized storage. Handcrafted quality.',
    price: 89.99,
    category: 'clothing',
    stock: 65,
    rating: 4.7,
    numReviews: 198,
    featured: false,
    brand: 'UrbanCraft',
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500']
  },
  {
    name: 'Smart LED Light Bulbs (4-Pack)',
    description: 'WiFi-enabled smart bulbs with 16 million colors. Voice control compatible. Set schedules and scenes via app.',
    price: 39.99,
    category: 'home',
    stock: 150,
    rating: 4.3,
    numReviews: 412,
    featured: false,
    brand: 'BrightHome',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=500']
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');

    await Product.deleteMany({});
    console.log('Products cleared');

    await User.deleteMany({});
    console.log('Users cleared');

    await Product.insertMany(products);
    console.log(`${products.length} products seeded`);

    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('Admin user created: admin@example.com / admin123');

    const testUser = await User.create({
      name: 'Test User',
      email: 'user@example.com',
      password: 'user123',
      role: 'user'
    });
    console.log('Test user created: user@example.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
