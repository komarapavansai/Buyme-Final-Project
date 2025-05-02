import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useCreateAuctionMutation, useDeleteAuctionMutation, useGetMyAuctionsQuery, useUpdateAuctionMutation } from '../slices/auctionApiSlice';
import { Link } from 'react-router-dom';
import AuctionFormModal from '../components/AuctionFormModal';
import Loader from '../components/Loader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Fade, Zoom } from 'react-awesome-reveal';

const MyAuctionsScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: myAuctions = [], isLoading, error, refetch } = useGetMyAuctionsQuery(userInfo?.user_id);
  const [createAuction] = useCreateAuctionMutation();
  const [updateAuction] = useUpdateAuctionMutation();
  const [deleteAuction] = useDeleteAuctionMutation();
  const [editAuction, setEditAuction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleCreateClick = () => {
    setEditAuction(null); // New auction
    setShowModal(true);
  };

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

  // const { data: myAuctions, isLoading, error } = useGetMyAuctionsQuery(userInfo?.user_id);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Auctions</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Create Auction
        </button>
      </div>

      {isLoading && <Loader/>}
      {error && <div className="text-red-500">Error loading auctions</div>}

      {myAuctions?.data?.length === 0 && (
        <div className="text-center text-gray-600">You have no auctions yet.</div>
      )}

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {myAuctions?.data?.map((auction) => (
            <>
            <div className="bg-white shadow-md rounded p-4 hover:shadow-lg transition cursor-pointer">
            <Fade cascade direction="up">
              <Link key={auction.auction_id} to={`/my-auctions/${auction.auction_id}`}>
              <img
                src={auction.image_url || 'https://placehold.co/300x200'}
                alt={auction.auction_title}
                className="w-full h-40 object-cover rounded mb-4"
              />
              </Link>
              <h3 className="text-lg font-bold mb-2">{auction.auction_title}</h3>
              <p className="text-gray-700">{auction.auction_desc}</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(auction);
                  }}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    console.log(auction)
                    e.stopPropagation();
                    handleDeleteAuction(auction.auction_id);
                  }}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </Fade>
            </div>
          </>
        ))}
      </div>

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

export default MyAuctionsScreen;
