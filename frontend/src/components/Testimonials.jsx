import React, { useState, useEffect, useRef } from 'react';
import { Star, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { getLatestReviews } from '../api/reviewApi';

const ReviewCard = ({ name, isVerified, rating, comment }) => {
  const truncateText = (text, maxLength = 200) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className="w-full md:w-[400px] h-full bg-white border border-black/10 rounded-[20px] p-6 md:p-8 flex flex-col transition-all">
      {/* Stars */}
      <div className="flex gap-[6px] mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={24}
            fill={i < Math.round(rating) ? '#FFC633' : '#F0F0F0'}
            strokeWidth={0} 
          />
        ))}
      </div>

      {/* Name + Verified Badge */}
      <div className="flex items-center gap-1 mb-3">
        <span className="font-satoshi font-bold text-base md:text-[20px] text-black tracking-tight">{name}</span>
        {isVerified && (
          <div className="w-[19px] h-[19px] rounded-full bg-[#01AB31] flex items-center justify-center flex-shrink-0">
            <Check size={12} color="white" strokeWidth={5} />
          </div>
        )}
      </div>

      {/* Review text */}
      <p className="font-satoshi text-black/60 text-sm md:text-base leading-[22px] md:leading-[24px] overflow-hidden">
        {truncateText(comment).replace(/^"|"$/g, '')}
      </p>
    </div>
  );
};

const staticReviews = [
  { _id: 's1', name: 'Sarah M.', isVerified: true, rating: 5, comment: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations." },
  { _id: 's2', name: 'Alex K.', isVerified: true, rating: 5, comment: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions." },
  { _id: 's3', name: 'James L.', isVerified: true, rating: 5, comment: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends." },
  { _id: 's4', name: 'Mooen S.', isVerified: true, rating: 5, comment: "Shop.co has completely changed the way I shop for clothes. The quality is exceptional, and the customer service is even better. I highly recommend them!" },
  { _id: 's5', name: 'Lily R.', isVerified: true, rating: 5, comment: "I've tried many online fashion stores, but Shop.co stands out for its unique collection and fast delivery. The fit of the clothes is perfect, and they look exactly like the pictures." }
];

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const CARD_WIDTH = 420; // approx card+gap to scroll per click

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -CARD_WIDTH, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: CARD_WIDTH, behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getLatestReviews();
        setReviews(data.data?.length > 0 ? data.data : staticReviews);
      } catch {
        setReviews(staticReviews);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-16 py-16 md:py-20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 md:mb-10">
        <h2 className="font-integral font-extrabold text-[32px] md:text-[48px] text-black uppercase leading-tight tracking-tight">
          OUR HAPPY CUSTOMERS
        </h2>

        {/* Arrow Buttons - Aligned with text */}
        <div className="flex items-center gap-3 pt-4">
          <button
            onClick={scrollLeft}
            className="text-black hover:opacity-50 transition-opacity"
            aria-label="Previous review"
          >
            <ArrowLeft size={28} strokeWidth={2} />
          </button>
          <button
            onClick={scrollRight}
            className="text-black hover:opacity-50 transition-opacity"
            aria-label="Next review"
          >
            <ArrowRight size={28} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Cards Row */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-5 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory cursor-grab active:cursor-grabbing"
      >
        {loading
          ? [1, 2, 3].map((i) => (
              <div
                key={i}
                className="min-w-[340px] md:min-w-[400px] h-[220px] bg-gray-100 rounded-[20px] animate-pulse flex-shrink-0"
              />
            ))
            : reviews.map((review) => (
                <div key={review._id} className="snap-start flex-shrink-0 flex">
                  <ReviewCard {...review} />
                </div>
              ))}
      </div>
    </section>
  );
};

export default Testimonials;
