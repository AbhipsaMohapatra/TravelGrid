import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Navbar from '../components/Custom/Navbar';
import Footer from '../components/Custom/Footer';
import hotels from '../data/hotels';


function Hotels() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filteredHotels = hotels.filter((hotel) => {
    const q = query.toLowerCase();
    return (
      hotel.name.toLowerCase().includes(q) ||
      hotel.location.toLowerCase().includes(q)
    );
  });

// Function to handle saving a hotel to the user's dashboard
const handleLike = async (hotel) => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert("You must be logged in to save places.");
    return;
  }

  const body = {
    placeId: hotel.id, 
    name: hotel.name,
    location: hotel.location,
    description: hotel.description,
  };

  try {
    const res = await fetch('http://localhost:5000/api/save/save-place', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success('Place saved successfully to dashboard!');
    } else {
      toast.error(data.message || '⚠️ This place is already saved.');
    }
  } catch (err) {
    console.error('Save failed:', err);
    toast.error('🚨 Failed to save place. Please try again.');
  }
};


  return (
 bg-change
    <div className="flex flex-col min-h-screen w-full  overflow-x-hidden bg-gradient-to-br from-[#f6f0d6] via-[#f3eada] to-[#e9dfd1]">


      {<Navbar lightBackground />}   {/*Added props of lightBackground to this page.*/}


      <main className="flex flex-col flex-1 w-full items-center">
        {/* Hero + Search */}
 bg-change
        <section className="w-full py-24 flex flex-col items-center text-center px-4 style={{ backgroundColor: '#efe6db' }}">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#3f3226] mb-4">
            Explore World-Class <span className="text-[#a07b4f]">Hotels</span>
          </h1>
          <p className="text-lg md:text-xl text-[#4b3a2d] max-w-2xl mb-8">

            Browse and book from our curated list of the top luxury hotels worldwide.
          </p>
          <div className="w-full max-w-lg">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by hotel or destination..."
              className="w-full px-6 py-4 rounded-xl bg-white border border-[#cbb8a6] text-[#3f3226] placeholder-[#816b55] focus:outline-none focus:ring-4 focus:ring-[#d6c2ae]/40 focus:border-[#b2967a] shadow-lg transition-all"
            />
          </div>
        </section>

        {/* Hotel List */}
        <section className="max-w-7xl w-full px-4 pb-16 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredHotels.map((hotel) => (
            <div
              key={hotel.id}
               className="bg-white border border-[#e0d4c4] rounded-2xl shadow-xl overflow-hidden flex flex-col hover:shadow-[#c1a983]/40 transition-all duration-300 transform hover:scale-105"
            >
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-56 object-cover object-center"
              />
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-2xl font-semibold text-[#3f3226] mb-1">
                  {hotel.name}
                </h3>
                <span className="text-[#a07b4f]  font-medium mb-3">
                  {hotel.location}
                </span>
                <p className="text-sm text-[#4b3a2d] line-clamp-3 flex-1">
                  {hotel.description}
                </p>
                <button
                  onClick={() => navigate(`/hotels/${hotel.id}`)}
                  className="mt-4 self-start bg-gradient-to-r from-[#b27a53] to-[#a96e42] hover:from-[#a96e42] hover:to-[#b27a53] text-white px-5 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  Book Hotel
                </button>
                {/* Button to save places */}
                <button
                  onClick={() => handleLike(hotel)}
                  className="mt-2 bg-pink-100 hover:bg-pink-200 text-pink-600 px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  ❤️ Save to Dashboard
                </button>

              </div>
            </div>
          ))}
          {filteredHotels.length === 0 && (
            <p className="col-span-full text-center text-gray-600 text-lg font-medium">
              No hotels match your search.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

export default Hotels; 