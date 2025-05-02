import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {toast} from 'react-toastify';

const AlertsScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [category, setCategory] = useState('');
  const [prizeLt, setPrizeLt] = useState('');
  const [prizeGt, setPrizeGt] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        '/api/alert/',
        {
          item_category: category,
          prize_lt: Number(prizeLt),
          prize_gt: Number(prizeGt),
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.data}`,
          },
        }
      );
      toast.success('Alert created successfully');
      setCategory('');
      setPrizeLt('');
      setPrizeGt('');
    } catch (err) {
      console.error('Failed to create alert', err);
      toast.error('Failed to create alert');
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Alert</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Item Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="e.g. Electronics"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Price Less Than</label>
          <input
            type="number"
            value={prizeLt}
            onChange={(e) => setPrizeLt(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Price Greater Than</label>
          <input
            type="number"
            value={prizeGt}
            onChange={(e) => setPrizeGt(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Create Alert
        </button>
      </form>
    </div>
  );
};

export default AlertsScreen;
