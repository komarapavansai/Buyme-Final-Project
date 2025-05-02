import React, { useEffect } from 'react';
import { useGetNotificationsQuery, useNotifyBidMutation } from '../slices/notificationApiSlice';
import Loader from '../components/Loader';
import { FaSyncAlt } from 'react-icons/fa';
import { Fade } from 'react-awesome-reveal';

const NotificationsPage = () => {
  const [notifyBid] = useNotifyBidMutation();
  const { data, isLoading, error, refetch } = useGetNotificationsQuery();
  let notifications = [...(data?.data || [])].reverse();

  const handleRefresh = async () => {
    try {
      await notifyBid();
      console.log('Notifiy sent!')
      refetch();
    } catch (err) {
      console.error('Notification API error:', err);
    }
  };

  useEffect(() => {
    const sendNotification = async () => {
      try {
        await notifyBid();
      } catch (err) {
        console.error('Notification API error:', err);
      }
    };
  
    sendNotification();
    refetch();
  }, [notifyBid, refetch]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Notifications</h2>

        { isLoading ? (
          <Loader/>
          ):(
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <FaSyncAlt className="mr-1" /> Refresh
          </button>
        )}
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <div className="text-red-500">Failed to load notifications.</div>
      ) : notifications.length === 0 ? (
        <div className="text-gray-500">No notifications available.</div>
      ) : (
        <Fade cascade direction="right" triggerOnce>
        <ul className="space-y-4">
          {notifications.map((notif) => (
            <li key={notif.id} className="bg-white shadow p-4 rounded">
              <p className="text-xs text-gray-400 mb-1">Notification Type: <span className="font-semibold text-blue-500">{notif.topic}</span></p>
              <p className="font-semibold text-blue-700">{notif.title}</p>
              <p className="text-sm text-gray-700 mt-1">{notif.description}</p>
            </li>
          ))}
        </ul>
        </Fade>
      )}
    </div>
  );
};

export default NotificationsPage;
