import React, { useState, useEffect } from 'react';
import { useGetAuctionsQuery } from '../slices/auctionApiSlice';
import AuctionCard from '../components/AuctionCard';
import AuctionFilters from '../components/AuctionFilters';
import Loader from '../components/Loader';
import { Fade } from 'react-awesome-reveal';

const AuctionsScreen = () => {
  const { data, isLoading, error } = useGetAuctionsQuery();
  const auctions = data?.data || [];
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [displayCount, setDisplayCount] = useState(6);

  useEffect(() => {
    if (auctions.length > 0) {
      let filtered = auctions;

      if (searchTerm) {
        filtered = filtered.filter((auction) =>
          auction.auction_title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      console.log(selectedCategory)
      if (selectedCategory) {
        filtered = filtered.filter((auction) => ( selectedCategory === 'All' || auction.category === selectedCategory));
      }

      setFilteredAuctions(filtered);
    }
  }, [auctions, searchTerm, selectedCategory]);

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 6);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Browse Auctions</h1>

      <AuctionFilters
        search={searchTerm}
        setSearch={setSearchTerm}
        category={selectedCategory}
        setCategory={setSelectedCategory}
      />

      {isLoading ? (
        <Loader />
      ) : error ? (
        <div className="text-center text-red-500">
          {error?.data?.message || 'Error fetching auctions'}
        </div>
      ) : filteredAuctions.length === 0 ? (
        <div className="text-center text-gray-600">No auctions found.</div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4">
          <Fade cascade direction="up">
            {filteredAuctions.slice(0, displayCount).map((auction) => {
              {return <AuctionCard key={auction.auction_id} item={auction} />}
            })}
          </Fade>
          </div>

          {displayCount < filteredAuctions.length && (
            <div className="text-center mt-6">
              <button
                onClick={handleLoadMore}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AuctionsScreen;