import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const AuctionCard = ({ item }) => {
  const { userInfo } = useSelector((state) => state.auth);
  console.log(userInfo);

  const [showModal, setShowModal] = useState(false);  
  const handleEditClick = (auction) => {
    setEditAuction(auction); // Pass auction for editing
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditAuction(null);
  };

  const handleModalSubmit = async (formData) => {
    try {
      const payload = {
        ...formData,
        start_date: new Date(formData.start_date).getTime(),
        end_date: new Date(formData.end_date).getTime(),
      };

      if (editAuction) {
        await updateAuction({ id: editAuction.auction_id, body: payload }).unwrap();
        toast.success('Auction updated successfully!');
      } else {
        await createAuction(payload).unwrap();
        toast.success('Auction created successfully!');
      }

      refetch();
      handleModalClose();
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const handleDeleteAuction = async (id) => {
    if (window.confirm('Are you sure you want to delete this auction?')) {
      try {
        await deleteAuction(id).unwrap();
        toast.success('Auction deleted!');
        refetch();
      } catch (err) {
        console.error(err);
        toast.error('Failed to delete auction');
      }
    }
  };


  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
      <Link to={`/auction/${item.auction_id}`}>
        <img
          src={item.image_url || 'https://placehold.co/300x200'} // fallback placeholder if missing
          alt={item.auction_title}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <h3 className="text-lg font-bold truncate">{item.auction_title}</h3>
        <p className="text-gray-600 text-sm">{item.category}</p>
        {/* If you have start_date / end_date, you can also show them here nicely */}
      </div>
      {(userInfo?.is_admin || userInfo?.is_customer_repr ) && (
        <div className="flex justify-end space-x-2 px-3 py-1 mt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(auction); // assumes you define this like in MyAuctionsScreen
            }}
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteAuction(auction.auction_id); // assumes similar function
            }}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
)}
      {showModal && (
        <AuctionFormModal
        open={showModal}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        initialValues={editAuction}
      />
      )}
    </div>
  );
};

export default AuctionCard;
