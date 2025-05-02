import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';

const MyBiddingsScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [bids, setBids] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBids = async () => {
      try {
        const { data } = await axios.get('/api/bid/user', {
          headers: { Authorization: `Bearer ${userInfo.data}` },
        });
        setBids(data.data);

        const itemDetails = await Promise.all(
          data.data.map((bid) =>
            axios.get(`/api/item/${bid.item_id}`, {
              headers: { Authorization: `Bearer ${userInfo.data}` },
            })
          )
        );

        const enriched = itemDetails.map((res, idx) => ({
          ...res.data.data,
          ...data.data[idx],
        }));

        setItems(enriched);
      } catch (err) {
        console.error('Failed to fetch biddings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBids();
  }, [userInfo]);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Biddings</h1>
        <Link to="/qna" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Q & A
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-600 text-center">You haven't placed any bids yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.item_id} className="bg-white shadow rounded p-4 relative">
              {item.is_won && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                  You won this item
                </div>
              )}
              <img
                src={item.image_url || 'https://placehold.co/300x200'}
                alt={item.item_name}
                className="w-full h-40 object-contain rounded mb-2"
              />
              <h3 className="text-lg font-bold mb-1">{item.item_name}</h3>
              <p className="text-gray-700 text-sm mb-2">{item.item_desc}</p>
              <p className="text-sm text-gray-900 font-semibold">Your Bid: ${item.curr_investment}</p>
              <p className="text-xs text-gray-500">Max Allowed: ${item.max_investment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBiddingsScreen;
