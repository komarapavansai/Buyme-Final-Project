import React from 'react';
import { useParams } from 'react-router-dom';

const EditAuctionScreen = () => {
  const { id } = useParams(); // get auction id from URL
  
  return (
    <div className="py-10 px-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Auction {id}</h1>
      {/* Form to edit auction will go here */}
    </div>
  );
};

export default EditAuctionScreen;
