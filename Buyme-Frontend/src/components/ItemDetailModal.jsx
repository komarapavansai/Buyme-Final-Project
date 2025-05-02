import { useDeleteItemMutation, useGetItemByIdQuery } from '../slices/itemApiSlice';
import { useGetAuctionParticipantsQuery } from '../slices/auctionApiSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from './Loader';
import ParticipateModal from './ParticipateModal';
import { useState } from 'react';
import { useGetAllUsersQuery } from '../slices/usersApiSlice';
import { useGetBidsByItemQuery } from '../slices/bidApiSlice';
import { Zoom } from 'react-awesome-reveal';
import axios from 'axios';

const ItemDetailModal = ({ itemId, auctionId, onClose, source }) => {
  const { userInfo } = useSelector((state) => state.auth);

  const { data: itemData, isLoading: isItemLoading, error: itemError } = useGetItemByIdQuery(itemId);
  const item = itemData?.data;

  const { data: participantsData, isLoading: isParticipantsLoading, error: participantsError } = useGetAuctionParticipantsQuery(auctionId);
  const participants = participantsData?.data || [];
  const [showParticipateModal, setShowParticipateModal] = useState(false);

  const [deleteItem] = useDeleteItemMutation();

  const { data: usersData, isLoading: isUsersLoading } = useGetAllUsersQuery();
  const { data: bidsData, isLoading: isBidsLoading } = useGetBidsByItemQuery(itemId);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(itemId).unwrap();
        toast.success('Item deleted successfully!');
        onClose();
        window.location.reload();
      } catch (err) {
        toast.error('Failed to delete item.');
      }
    }
  };

  const isParticipating = participants?.some((participant) => participant.participant_id === userInfo.user_id);

  const openParticipateModal = () => setShowParticipateModal(true);

  const openIncreaseBidModal = () => {
    console.log('Open Increase Bid Modal'); 
    // Will build this modal next
  };

  if (isItemLoading || isParticipantsLoading) return <Loader />;
  if (itemError || participantsError) return (
    <>
    {console.log(itemError)}
    {console.log(participantsError)}
    <div className="text-center text-red-500">Error loading data.</div>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <Zoom triggerOnce>
      <div className="bg-white p-6 rounded-md w-96 relative">

        {/* Modal Content */}
        <h2 className="text-2xl font-bold mb-4">{item.item_name}</h2>
        <img src={item.image_url} alt={item.item_name} className="w-full h-40 object-cover rounded mb-4" />
        <p className="text-gray-700 mb-2">{item.item_desc}</p>
        <p className="text-gray-900 font-semibold mb-2">${item.start_price}</p>

        {/* Participants */}
        {/* <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Participants:</h3>
          {participants.length === 0 ? (
            <p className="text-gray-500">No participants yet.</p>
          ) : (
            <ul className="list-disc list-inside text-gray-700">
              {participants.map((p) => {
                {console.log(bidsData)}
                const user = usersData?.data?.find((u) => u.user_id === p.participant_id);
                const bid = bidsData?.data?.find((b) => b.bidder_id === p.participant_id);

                return (
                  <li key={p.participant_id}>
                    {console.log(bid)}
                    {user ? user.first_name : `User #${p.participant_id}`} - ${bid ? bid.curr_investment : 0}
                  </li>
                );
              })}
            </ul>

          )}
        </div> */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Participants:</h3>
          {/* <div className="max-h-40 overflow-y-auto border p-2 rounded scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"> */}
          <div className="max-h-40 overflow-y-auto p-2 rounded">
          {/* <div className="max-h-40 overflow-y-auto border p-2 rounded"> */}
          {participants.length === 0 ? (
            <p className="text-gray-500">No participants yet.</p>
          ) : (
            <ul className="list-disc list-inside text-gray-700">
              {participants.map((p) => {
                const user = usersData?.data?.find((u) => u.user_id === p.participant_id);
                const bid = bidsData?.data?.find((b) => b.bidder_id === p.participant_id);

                return (
                  <li key={p.participant_id}>
                    {user ? user.first_name : `User #${p.participant_id}`} - ${bid ? bid.curr_investment : 0}
                  </li>
                );
              })}
            </ul>
          )}
          </div>
        </div>


        {/* Action Buttons */}
        <div className="flex justify-between space-x-4 mt-6">
        {source === 'auctions' && (
          <>
            <button
              onClick={openParticipateModal}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Place Bid
            </button>
            {isParticipating && (
              <button
                onClick={async () => {
                  try {
                    // Step 1: Get existing bid
                    const res = await axios.get(`/api/bid/${itemId}`, {
                      headers: { Authorization: `Bearer ${userInfo.data}` },
                    });

                    const bid = res.data?.data?.[0];
                    if (!bid) {
                      toast.error('Bid data not found');
                      return;
                    }

                    // Step 2: Construct new bid body
                    const newBid = {
                      auction_id: auctionId, // Ensure this is passed to the modal
                      is_auto_increment: true,
                      auto_increment_percent: 10,
                      max_investment: bid.max_investment, // or allow user to update later
                    };

                    // Step 3: POST new bid
                    console.log('new bid ', newBid)
                    await axios.post(`/api/bid/${itemId}`, newBid, {
                      headers: { Authorization: `Bearer ${userInfo.data}` },
                    });

                    toast.success('Your bid has been increased automatically!');
                  } catch (err) {
                    console.error(err);
                    toast.error('Failed to increase bid. Please place your big again');
                  }
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Increase My Bid
              </button>
            )}
          </>
          )}

          {source === 'my-auctions' && (
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          )}

          <button
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </Zoom>
      {showParticipateModal && (
        <ParticipateModal
          itemId={itemId}
          auctionId={auctionId}
          onClose={() => setShowParticipateModal(false)}
        />
      )}
    </div>
  );
};

export default ItemDetailModal;
