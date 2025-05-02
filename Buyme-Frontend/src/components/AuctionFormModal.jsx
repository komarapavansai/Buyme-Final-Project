import React, { useState, useEffect } from 'react';
import { Zoom } from 'react-awesome-reveal';

const AuctionFormModal = ({ open, onClose, onSubmit, initialValues = {} }) => {
  const [formData, setFormData] = useState({
    auction_title: initialValues?.auction_title || '',
    auction_desc: initialValues?.auction_desc || '',
    start_date: initialValues ? new Date(initialValues.start_date).toISOString().substr(0, 10) : '',
    end_date: initialValues ? new Date(initialValues.end_date).toISOString().substr(0, 10) : '',
    category: initialValues?.category || '',
    image_url: initialValues?.image_url || '',
  });  

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setFormData({
        auction_title: initialValues.auction_title || '',
        auction_desc: initialValues.auction_desc || '',
        start_date: initialValues.start_date ? new Date(initialValues.start_date).toISOString().slice(0, 16) : '',
        end_date: initialValues.end_date ? new Date(initialValues.end_date).toISOString().slice(0, 16) : '',
        category: initialValues.category || '',
        image_url: initialValues.image_url || '',
      });
    } else {
      // Reset when opening for creation
      setFormData({
        auction_title: '',
        auction_desc: '',
        start_date: '',
        end_date: '',
        category: '',
        image_url: '',
      });
    }
  }, [initialValues]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
    <Zoom triggerOnce>
      <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">
          {initialValues?.id ? 'Edit Auction' : 'Create Auction'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Auction Title</label>
            <input
              type="text"
              name="auction_title"
              value={formData.auction_title}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Auction Description</label>
            <textarea
              name="auction_desc"
              value={formData.auction_desc}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Start Date</label>
              <input
                type="datetime-local"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div className="flex-1">
              <label className="block mb-1 font-semibold">End Date</label>
              <input
                type="datetime-local"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Image URL</label>
            <input
              type="text"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </Zoom>
    </div>
  );
};

export default AuctionFormModal;
