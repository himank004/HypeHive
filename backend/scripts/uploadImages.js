import cloudinary from '../lib/cloudinary.js';
import axios from 'axios';

const images = [
  // Nike Air Max 90
  "https://www.aw-lab.com/dw/image/v2/BJTH_PRD/on/demandware.static/-/Sites-awlab-master-catalog/default/dw20dd8742/images/large/8011175_0.jpg?sw=358",
  
  // Adidas Ultraboost
  "https://assets.adidas.com/images/w_600,f_auto,q_auto/abcd1234/ultraboost.jpg",
  
  // Puma RS-X Reinvention
  "https://cdn.puma.com/media/catalog/product/abcd1234/rs-x-reinvention.jpg",
  
  // Reebok Classic Leather Shoes
  "https://assets.reebok.com/images/w_600,f_auto,q_auto/abcd1234/classic-leather.jpg",
  
  // Converse Chuck Taylor All Star High Top
  "https://images.converse.com/is/image/Converse/abcd1234/chuck-taylor-all-star-high-top.jpg",
  
  // Vans Old Skool Black White
  "https://images.vans.com/is/image/Vans/abcd1234/old-skool.jpg",
  
  // New Balance 574 Core
  "https://newbalance.com/images/w_600,f_auto,q_auto/abcd1234/574-core.jpg",
  
  // Asics Gel-Kayano 14
  "https://images.asics.com/is/image/Asics/abcd1234/gel-kayano-14.jpg",
  
  // Under Armour HOVR Phantom 2
  "https://underarmour.com/images/w_600,f_auto,q_auto/abcd1234/hovr-phantom-2.jpg",
  
  // Air Jordan 1 Retro High OG
  "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/abcd1234/air-jordan-1-retro-high-og.jpg"
];

const uploadImages = async () => {
  for (const image of images) {
    try {
      const response = await cloudinary.uploader.upload(image, {
        folder: 'products'
      });
      console.log('Uploaded:', response.secure_url);
    } catch (error) {
      console.error('Upload error:', error.message);
    }
  }
};

uploadImages();
