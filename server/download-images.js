const fs = require('fs');
const path = require('path');
const https = require('https');
const { promisify } = require('util');
const stream = require('stream');

const pipeline = promisify(stream.pipeline);

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// List of food images to download with their URLs
const foodImages = [
  {
    name: 'paneer-tikka-masala.jpg',
    url: 'https://images.unsplash.com/photo-1630918321887-9a8d9a40f113?w=500&auto=format&fit=crop&q=80'
  },
  {
    name: 'butter-chicken.jpg',
    url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=80'
  },
  {
    name: 'dal-makhani.jpg',
    url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80'
  },
  {
    name: 'samosa.jpg',
    url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80'
  },
  {
    name: 'garlic-naan.jpg',
    url: 'https://images.unsplash.com/photo-1631514624023-0a98be033c01?w=500&auto=format&fit=crop&q=80'
  },
  {
    name: 'gulab-jamun.jpg',
    url: 'https://images.unsplash.com/photo-1601050690111-6fdbdbd57f5a?w=500&auto=format&fit=crop&q=80'
  },
  {
    name: 'mango-lassi.jpg',
    url: 'https://images.unsplash.com/photo-1601050690812-2b5847854944?w=500&auto=format&fit=crop&q=80'
  }
];

async function downloadImage({ url, name }) {
  try {
    const filePath = path.join(imagesDir, name);
    
    // Skip if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`✓ ${name} already exists, skipping...`);
      return;
    }
    
    console.log(`Downloading ${name}...`);
    const response = await new Promise((resolve, reject) => {
      const req = https.get(url, resolve);
      req.on('error', reject);
    });
    
    if (response.statusCode !== 200) {
      throw new Error(`Failed to download ${url}: ${response.statusCode}`);
    }
    
    const fileStream = fs.createWriteStream(filePath);
    await pipeline(response, fileStream);
    console.log(`✓ Downloaded ${name}`);
  } catch (error) {
    console.error(`Error downloading ${name}:`, error.message);
  }
}

async function downloadAllImages() {
  console.log('Starting image download...');
  
  // Download all images in parallel
  await Promise.all(foodImages.map(downloadImage));
  
  console.log('All images downloaded successfully!');
}

// Run the download
downloadAllImages().catch(console.error);
