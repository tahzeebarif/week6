import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { createReview } from '../api/reviewApi';

const WriteReviewModal = ({ productId, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length < 10) {
      alert('Please write at least 10 characters for your review.');
      return;
    }

    setLoading(true);
    try {
      await createReview({ productId, rating, comment });
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[500px] rounded-[32px] p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-black font-integral uppercase mb-6 tracking-tight">Write a Review</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Selection */}
          <div className="space-y-2">
            <label className="text-sm font-bold font-satoshi text-black/60">Your Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform active:scale-90"
                >
                  <Star 
                    size={32} 
                    className={`${
                      (hoverRating || rating) >= star 
                        ? 'fill-[#FFC633] text-[#FFC633]' 
                        : 'text-gray-200'
                    } transition-colors`} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment input */}
          <div className="space-y-2">
            <label className="text-sm font-bold font-satoshi text-black/60">Your Review</label>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you like or dislike about the product..."
              className="w-full bg-[#F0F0F0] rounded-2xl p-4 min-h-[150px] outline-none border-2 border-transparent focus:border-black/5 transition-all text-sm font-satoshi"
              required
            ></textarea>
            <p className="text-[10px] text-black/40 text-right">Minimum 10 characters</p>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-black/90 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WriteReviewModal;
