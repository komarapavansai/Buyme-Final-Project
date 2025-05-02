import React from 'react';

const AuctionFilters = ({ search, setSearch, category, setCategory }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <input
        type="text"
        placeholder="Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 border border-gray-300 rounded w-full md:w-1/2"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="p-2 border border-gray-300 rounded w-full md:w-1/4"
      >
        <option value="All">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Fashion">Fashion</option>
        <option value="Vintage items">Vintage Items</option>
        <option value="Vehicles">Vehicles</option>
      </select>
    </div>
  );
};

export default AuctionFilters;
