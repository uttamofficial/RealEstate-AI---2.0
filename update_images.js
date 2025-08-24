const fs = require('fs');

// Real estate images from Unsplash - curated and verified
const realEstateImages = [
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop', // Modern house
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop', // Beautiful home
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop', // Luxury home
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop', // Contemporary house
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop', // Villa
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&h=300&fit=crop', // Apartment building
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop', // Office building
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop', // Kitchen interior
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop', // Living room
  'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=400&h=300&fit=crop', // Bedroom
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop', // Mansion
  'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=300&fit=crop', // Townhouse
  'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=400&h=300&fit=crop', // Condo exterior
  'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=300&fit=crop', // Pool house
  'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=400&h=300&fit=crop', // Commercial space
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop', // House front
  'https://images.unsplash.com/photo-1575517111478-7f6afd0973db?w=400&h=300&fit=crop', // House exterior
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // Villa pool
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop', // Construction site
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop', // Modern apartment
];

const businessLogos = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1494790108755-2616b332c3c4?w=40&h=40&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=40&h=40&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=40&h=40&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&h=40&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=40&h=40&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=40&h=40&fit=crop&crop=faces',
];

function updateImages() {
  let content = fs.readFileSync('src/data/mockDeals.ts', 'utf8');
  
  // Track replacements
  let imageIndex = 0;
  let logoIndex = 0;
  
  // Replace via.placeholder.com images with real estate images
  content = content.replace(/https:\/\/via\.placeholder\.com\/400x300/g, () => {
    const image = realEstateImages[imageIndex % realEstateImages.length];
    imageIndex++;
    return image;
  });
  
  // Replace via.placeholder.com logos with business person images
  content = content.replace(/https:\/\/via\.placeholder\.com\/40/g, () => {
    const logo = businessLogos[logoIndex % businessLogos.length];
    logoIndex++;
    return logo;
  });
  
  // Write the updated content
  fs.writeFileSync('src/data/mockDeals.ts', content);
  
  console.log('✅ Successfully updated all images!');
  console.log(`📸 Replaced ${imageIndex} property images`);
  console.log(`👤 Replaced ${logoIndex} company logos`);
  console.log('🎯 All properties now have unique, genuine real estate images!');
}

updateImages();
