import imgLaptop from './assets/laptop.webp';
import imgKeyboard from './assets/Bàn phím.jfif';
import imgMouse from './assets/Chuột.webp';
import imgBalo from './assets/Balo .jfif'; 
import Lenovo from './assets/Lenovo.webp'; 
import LenovoLOQ from './assets/LenovoLOQ.jfif'; 
import AKKO from './assets/AKKO.webp';  
import LogitechG102 from './assets/chuột logitech G102.jpg';  
import Balo from './assets/Balo .jfif'; 

export const categories = [
  { id: 'laptop', name: 'Laptop', image: imgLaptop },
  { id: 'keyboard', name: 'Bàn phím', image: imgKeyboard },
  { id: 'mouse', name: 'Chuột', image: imgMouse },
  { id: 'balo', name: 'Balo, Túi', image: imgBalo }
  
];


export const products = [
  {
    id: 1,
    categoryId: 'laptop',
    name: 'Lenovo ThinkBook 14 G8 IRL 215G007SVN',
    specs: 'Core 5 210H, 16GB, 512GB, WUXGA, Window 11',
    oldPrice: 19990000,
    newPrice: 17290000,
    discount: '-14%',
    gift: 'Quà 1.053.000',
    imageUrl: Lenovo
  },
  {
    id: 2,
    categoryId: 'laptop',
    name: 'Lenovo LOQ 15IAX9 83GS000RVN',
    specs: 'i5-12450HX, RTX 4050, 16GB, 512GB, FHD 144Hz',
    oldPrice: 24990000,
    newPrice: 22190000,
    discount: '-11%',
    gift: 'Quà 299.000',
    imageUrl: LenovoLoQ
  },
  {
    id: 3,
    categoryId: 'keyboard',
    name: 'Bàn phím cơ AKKO 3087 v2 World Tour',
    specs: 'Akko Switch (Blue/Orange/Pink), PBT Keycaps',
    oldPrice: 1590000,
    newPrice: 1390000,
    discount: '-13%',
    gift: 'Tặng kèm Keycap',
    imageUrl: AKKO
  },
  {
    id: 4,
    categoryId: 'mouse',
    name: 'Chuột Logitech G102 Lightsync RGB Black',
    specs: 'Gaming Mouse, 8000 DPI, 6 nút',
    oldPrice: 590000,
    newPrice: 450000,
    discount: '-24%',
    gift: 'Miễn phí ship',
    imageUrl: LogitechG102
  }, 
  
  {
    id: 5,
    categoryId: 'balo',
    name: 'Asus AP4600 Backpack',
    specs: 'Màu đen, đa dụng, hiện đại',
    oldPrice: 300000,
    newPrice: 250000,
    discount: '-17%',
    gift: 'Miễn phí ship',
    imageUrl: Balo
  },
  
];