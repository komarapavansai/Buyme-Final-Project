import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetAuctionByIdQuery, useGetAuctionItemsQuery } from '../slices/auctionApiSlice';
import { useCreateItemMutation, useAddItemToAuctionMutation } from '../slices/itemApiSlice';
import CreateItemModal from '../components/CreateItemModal';
import ItemDetailModal from '../components/ItemDetailModal';
import Loader from '../components/Loader';
import axios from 'axios';
import { useSelector } from 'react-redux';

const MyAuctionDetailScreen = () => {
  const { id } = useParams();

  const { userInfo } = useSelector((state) => state.auth);
  const { data, isLoading: auctionLoading, error: auctionError } = useGetAuctionByIdQuery(id);
  const auction = data?.data || {};
  const { data: itemsData, isLoading: itemsLoading, error: itemsError } = useGetAuctionItemsQuery(id);

  const [createItem] = useCreateItemMutation();
  const [addItemToAuction] = useAddItemToAuctionMutation();
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // const items = itemsData?.data || [];

  const auctionItems = itemsData?.data || [];

  const [fullItems, setFullItems] = useState([]);

  useEffect(() => {
    const fetchFullItems = async () => {
      try {
        const results = await Promise.all(
          auctionItems.map((a) =>
            axios.get(`/api/item/${a.item_id}`, {
              headers: { Authorization: `Bearer ${userInfo.data}` }
            })
          )
        );
        setFullItems(results.map(result=> result.data.data));
        console.log(results.map(result=> result.data.data))
      } catch (err) {
        console.error('Failed to fetch item details', err);
      }
    };
  
    if (auctionItems?.length > 0) {
      fetchFullItems();
    }
  }, [auctionItems]);

  let items = [];

  console.log(auctionItems)

  fullItems.forEach((item) => {
    auctionItems.forEach((a) => {
      if (a.item_id === item.item_id) {
        items.push(item);
      }
    });
  });

  const handleAddItem = async (itemData) => {
    const newItemData = await createItem(itemData).unwrap();
    console.log(newItemData);
    const newItem=(newItemData?.data || {});
    await addItemToAuction({ auctionId: id, itemId: newItem.item_id }).unwrap();
    window.location.reload();
  };

  if (auctionLoading || itemsLoading) {
    return <Loader/>;
  }

  if (auctionError || itemsError) {
    return <div className="text-center text-red-500 p-6">Error loading auction details.</div>;
  }

  return (
    <div className="p-6">
      <div className="bg-white shadow-md rounded p-6 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">{auction?.auction_title}</h1>
          <p className="text-gray-700 mb-4">{auction?.auction_desc}</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Item
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4">Items in this Auction</h2>

      {items.length === 0 ? (
        <div className="text-center text-gray-600">No items found in this auction.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {console.log(items)}
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-md rounded p-4 cursor-pointer hover:shadow-lg transition"
              onClick={() => {
                setSelectedItemId(item.item_id);
                setShowItemModal(true);
              }}
            >
              <img
                src={item.image_url || 'https://placehold.co/300x200'}
                alt={item.item_name}
                className="w-full h-40 object-contain rounded mb-4 bg-white"
              />
              <h3 className="text-lg font-bold mb-2">{item.item_name}</h3>
              <p className="text-gray-700 mb-2">{item.item_desc}</p>
              <p className="text-gray-900 font-semibold">{item.start_price}</p>
              <div className="text-sm text-gray-500">
                <p>Start: {item.start_date ? new Date(item.start_date).toLocaleString() : 'N/A'}</p>
                <p>End: {item.end_date ? new Date(item.end_date).toLocaleString() : 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateItemModal
          auctionId={id}
          onClose={() => setShowCreateModal(false)}
          onItemCreated={handleAddItem}
        />
      )}

      {showItemModal && selectedItemId && (
        <ItemDetailModal
          itemId={selectedItemId}
          auctionId={auction.auction_id}
          source="my-auctions"
          onClose={() => {
            setShowItemModal(false);
            setSelectedItemId(null);
          }}
        />
      )}
    </div>
  );
};

export default MyAuctionDetailScreen;
