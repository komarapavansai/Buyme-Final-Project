import React, { useState } from 'react';
import { Zoom } from 'react-awesome-reveal';

const CreateItemModal = ({ auctionId, onClose, onItemCreated }) => {
  const [itemData, setItemData] = useState({
    item_name: '',
    item_desc: '',
    start_price: '',
    reserve_price: '',
    sub_category: '',
    image_url: '',
  });

  const handleChange = (e) => {
    setItemData({ ...itemData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onItemCreated(itemData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <Zoom triggerOnce>
      <div className="bg-white p-6 rounded-lg w-96 space-y-4">
        <h2 className="text-xl font-bold mb-2">Add New Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="item_name"
            placeholder="Item Name"
            value={itemData.item_name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            name="item_desc"
            placeholder="Item Description"
            value={itemData.item_desc}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="number"
            name="start_price"
            placeholder="Start Price"
            value={itemData.start_price}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="number"
            name="reserve_price"
            placeholder="Reserve Price"
            value={itemData.reserve_price}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="sub_category"
            placeholder="Sub Category"
            value={itemData.sub_category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="image_url"
            placeholder="Image URL"
            value={itemData.image_url}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Save
            </button>
          </div>
        </form>
      </div>
    </Zoom>
    </div>
  );
};

export default CreateItemModal;
