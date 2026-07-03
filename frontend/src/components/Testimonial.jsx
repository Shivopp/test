import { useState } from 'react';

export default function Testimonial() {
  const reviews = [
    {
      id: 1,
      name: "Ananya Sharma",
      role: "Verified Buyer",
      rating: 5,
      comment: "Absolutely love the product quality! The delivery was extremely fast, and the customer support team helped me track my package instantly.",
      date: "June 15, 2026"
    },
    {
      id: 2,
      name: "Rohan Verma",
      role: "Tech Enthusiast",
      rating: 5,
      comment: "The wireless headphones exceed expectations. Battery life lasts for days, and the sound profile is perfectly balanced for the price point.",
      date: "June 18, 2026"
    },
    {
      id: 3,
      name: "Priya Patel",
      role: "Regular Customer",
      rating: 4,
      comment: "Great experience shopping here. The admin dashboard updates inventory levels transparently so I always know what is in stock.",
      date: "June 20, 2026"
    }
  ];

  return (
    <section className="bg-white border-t border-b border-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Customer Reviews</h2>
          <p className="text-sm text-gray-500 mt-2">See what our community has to say about their shopping experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <span key={index} className="text-lg">⭐</span>
                  ))}
                </div>
                
                <p className="text-gray-600 text-sm italic leading-relaxed">
                  "{review.comment}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200/60 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-950 text-sm">{review.name}</h4>
                  <p className="text-xs text-purple-600 font-medium">{review.role}</p>
                </div>
                <span className="text-xs text-gray-400">{review.date}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}