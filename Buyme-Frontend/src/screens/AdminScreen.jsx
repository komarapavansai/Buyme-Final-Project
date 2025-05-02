import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AdminEarningsReport = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportRes, userRes, itemRes] = await Promise.all([
          axios.get('/api/admin/report/earnings', {
            headers: { Authorization: `Bearer ${userInfo.data}` },
          }),
          axios.get('/api/user', {
            headers: { Authorization: `Bearer ${userInfo.data}` },
          }),
          axios.get('/api/item', {
            headers: { Authorization: `Bearer ${userInfo.data}` },
          }),
        ]);

        setReport(reportRes.data.data);
        setUsers(userRes.data.data || []);
        setItems(itemRes.data.data || []);
      } catch (error) {
        console.error('Failed to fetch report or supplemental data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userInfo]);

  const getUserName = (id) => users.find((u) => u.user_id === id)?.first_name || `User #${id}`;
  const getItemName = (id) => items.find((i) => i.item_id === id)?.item_name || `Item #${id}`;

  if (!userInfo?.is_admin ) {
    return <p className="text-red-500 text-center mt-10">Access denied: Admins only</p>;
  }

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Earnings Report</h1>

      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Total Earnings</h2>
        <p className="text-2xl font-bold text-green-600">${report.totalEarnings}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-2">Earnings per Item</h3>
          <ul className="text-sm space-y-1">
            {report.earningsPerItem.map((item) => (
              <li key={item.item_id}>{getItemName(item.item_id)}: ${item.total}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-2">Earnings per Category</h3>
          <ul className="text-sm space-y-1">
            {report.earningsPerCategory.map((cat, index) => (
              <li key={index}>{cat.category || 'Uncategorized'}: ${cat.total}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-2">Earnings per Seller</h3>
          <ul className="text-sm space-y-1">
            {report.earningsPerSeller.map((s) => (
              <li key={s.seller_id}>{getUserName(s.seller_id)}: ${s.total}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-2">Earnings per Item Type</h3>
          <ul className="text-sm space-y-1">
            {report.earningsPerItemType.map((type, index) => (
              <li key={index}>{type.category || 'Unknown'}: ${type.total}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-2">Best Buyers</h3>
          <ul className="text-sm space-y-1">
            {report.bestBuyers.map((b) => (
              <li key={b.bidder_id}>{getUserName(b.bidder_id)}: ${b.total}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white shadow rounded p-4 col-span-2">
          <h3 className="text-lg font-semibold mb-4">Best Selling Items (Chart)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={report.bestSellingItems.map((item) => ({
                name: getItemName(item.item_id),
                total: Number(item.total),
              }))}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminEarningsReport;
