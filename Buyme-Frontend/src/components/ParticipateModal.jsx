import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { usePlaceBidMutation } from '../slices/bidApiSlice'; // you'll create this next
import { useGetBidsByItemQuery } from '../slices/bidApiSlice';
import Loader from './Loader';

const ParticipateModal = ({ itemId, auctionId, onClose }) => {
  const [maxInvestment, setMaxInvestment] = useState('');
  const [isAutoIncrement, setIsAutoIncrement] = useState(false);
  const [autoIncrementPercent, setAutoIncrementPercent] = useState('');
  const [manualInvestmentAmount, setManualInvestmentAmount] = useState('');

  const { userInfo } = useSelector((state) => state.auth);
  const [placeBid, { isLoading }] = usePlaceBidMutation();
  const { data: bidsData, refetch: bidsRefetch } = useGetBidsByItemQuery(itemId);
  const investments = bidsData?.data?.map((b) => b.curr_investment) || [];
  const maxCurrInvestment = investments.length > 0 ? Math.max(...investments) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!maxInvestment) {
      toast.error('Please enter max investment');
      return;
    }

    const payload = {
      auction_id: auctionId,
      is_auto_increment: isAutoIncrement,
      auto_increment_percent: isAutoIncrement ? Number(autoIncrementPercent) : 0,
      max_investment: Number(maxInvestment),
      manual_investment_amount: !!manualInvestmentAmount ? Number(manualInvestmentAmount): 0
    };

    try {
      console.log(payload)
      await placeBid({ itemId, bidData: payload }).unwrap();
      toast.success('Bid placed successfully!');
      bidsRefetch();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err?.data?.error || err.error || 'Failed to place bid');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md w-96 relative space-y-4">

        <h2 className="text-xl font-bold">Participate in Bidding</h2>

        {!!!isAutoIncrement && (
          <div>
            <label className="block font-semibold">Current Investment Amount ($)</label>
            <input
              type="number"
              placeholder={`Start from at least $${maxCurrInvestment}`}
              className="w-full border px-3 py-2 rounded"
              value={manualInvestmentAmount}
              onChange={(e) => setManualInvestmentAmount(e.target.value)}
              required
            />
          </div>
        )}

        <div>
          <label className="block font-semibold">Max Investment ($)</label>
          <input
            type="number"
            placeholder={`Start from at least $${maxCurrInvestment}`}
            className="w-full border px-3 py-2 rounded"
            value={maxInvestment}
            onChange={(e) => setMaxInvestment(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isAutoIncrement}
            onChange={() => setIsAutoIncrement(!isAutoIncrement)}
          />
          <label>Enable Auto Increment</label>
        </div>

        {isAutoIncrement && (
          <div>
            <label className="block font-semibold">Auto Increment Percent (%)</label>
            <input
              type="number"
              className="w-full border px-3 py-2 rounded"
              value={autoIncrementPercent}
              onChange={(e) => setAutoIncrementPercent(e.target.value)}
              required
            />
          </div>
        )}

        <div className="flex justify-end space-x-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            {isLoading ? <Loader/> : 'Place Bid'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ParticipateModal;
