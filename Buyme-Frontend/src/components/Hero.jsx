// import { Link } from 'react-router-dom';

// const Hero = () => {
//   return (
//     <div className="py-10 bg-gray-100">
//       <div className="container mx-auto flex justify-center">
//         <div className="bg-white p-8 flex flex-col items-center shadow-md rounded-md w-full max-w-2xl">
//           <h1 className="text-3xl font-bold text-center mb-4">Authentication</h1>
//           <p className="text-center text-gray-700 mb-6">
//             Sigin or register
//           </p>
//           <div className="flex space-x-4">
//             <Link
//               to="/login"
//               className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-300"
//             >
//               Sign In
//             </Link>
//             <Link
//               to="/register"
//               className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition duration-300"
//             >
//               Register
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Hero;

import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

const products = [
  { id: 1, name: 'Product 1', image: 'https://placehold.co/300x200', description: 'This is product 1' },
  { id: 2, name: 'Product 2', image: 'https://placehold.co/300x200', description: 'This is product 2' },
  { id: 3, name: 'Product 3', image: 'https://placehold.co/300x200', description: 'This is product 3' },
  { id: 4, name: 'Product 4', image: 'https://placehold.co/300x200', description: 'This is product 4' },
];

const featuredAuctions = [
  { id: 1, title: 'Featured Auction 1', image: 'https://placehold.co/300x180', currentBid: 62.5 },
  { id: 2, title: 'Featured Auction 2', image: 'https://placehold.co/300x180', currentBid: 80.0 },
  { id: 3, title: 'Featured Auction 3', image: 'https://placehold.co/300x180', currentBid: 44.75 },
];

const carouselImages = [
  'https://placehold.co/800x300?text=Slide+1',
  'https://placehold.co/800x300?text=Slide+2',
  'https://placehold.co/800x300?text=Slide+3',
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAuctionClick = (id) => {
    navigate(`/auction/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-10 bg-gray-100">
      {/* Carousel */}
      <div className="w-full max-w-5xl mx-auto px-4 mb-10">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation
          pagination={{ clickable: true }}
        >
          {carouselImages.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                className="w-full h-64 object-cover rounded-lg"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Featured Products */}
      <div className="w-full max-w-6xl mx-auto px-4 mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Featured Products</h2>
        <div className="flex flex-wrap gap-6 justify-center">
          {products.map((product) => (
            <div
              key={product.id}
              className="w-full sm:w-60 bg-white rounded-lg shadow-md p-4 flex-shrink-0"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-36 object-cover rounded"
              />
              <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
              <p className="text-gray-600 text-sm">{product.description}</p>
              <button className="mt-3 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                View
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Auctions */}
      <div className="w-full max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Featured Auctions</h2>
        <div className="flex flex-wrap gap-6 justify-center">
          {featuredAuctions.map((auction) => (
            <div
              key={auction.id}
              className="w-full sm:w-60 bg-white rounded-lg shadow-md p-4 flex-shrink-0"
            >
              <img
                src={auction.image}
                alt={auction.title}
                className="w-full h-36 object-cover rounded"
              />
              <h3 className="text-lg font-semibold mt-2">{auction.title}</h3>
              <p className="text-gray-600 text-sm">Current Bid: ${auction.currentBid.toFixed(2)}</p>
              <button
                onClick={() => handleAuctionClick(auction.id)}
                className="mt-3 w-full bg-green-600 text-white text-center py-2 rounded hover:bg-green-700 transition"
              >
                View Auction
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;