import React, { useState, useEffect } from "react";
import { MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import { Link } from "react-router-dom";
import { color } from "framer-motion";
import { useAuth } from '../context/AuthContext';
import AddEventModal from "@/components/Modals/AddEventModal";

const forumTopics = [
  {
    id: 1,
    title: "Best travel hacks for solo travelers",
    description: "Share your favorite tips for solo adventures.",
    replies: [
      "Always keep digital copies of your documents.",
      "Pack light and use a universal adapter.",
    ],
  },
  {
    id: 2,
    title: "How to plan a budget-friendly trip to Leh",
    description: "Looking for affordable travel and stay options.",
    replies: [
      "Travel by bus and stay in hostels for best rates.",
      "Book flights early and try local guesthouses.",
    ],
  },
  {
    id: 3,
    title: "Top 5 underrated places in South India",
    description: "Suggest hidden gems for my next trip.",
    replies: [
      "Try Chettinad, Hampi, and Gokarna.",
      "Araku Valley and Yercaud are beautiful too!",
    ],
  },
];

export default function Forum() {
  const [openReplies, setOpenReplies] = useState({});
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [modal,setModal] = useState(false);
  const {isAuthenticated} = useAuth();

  //use effect to load all the events 

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/post/allPosts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err));
  }, []);

  const getTag = (tag) => {
    switch (tag.toLowerCase()) {
      case "travel":
        return "bg-gradient-to-r from-indigo-400 to-amber-200 text-black px-2 py-1 rounded hover:cursor-pointer";
      case "wishlist":
        return "bg-gradient-to-r from-pink-400 to-white text-black px-2 py-1 rounded hover:cursor-pointer";
      case "pending":
        return "bg-gradient-to-r from-yellow-400 to-white text-black px-2 py-1 rounded hover:cursor-pointer";
      default:
        return "bg-gray-200 text-black px-2 py-1 rounded hover:cursor-pointer";
    }
  };

  //Set of gradient colors to choose from
  const colors = [
    "bg-gradient-to-r from-indigo-400 to-purple-400",
    "bg-gradient-to-r from-pink-400 to-rose-400",
    "bg-gradient-to-r from-yellow-400 to-orange-400",
    "bg-gradient-to-r from-green-400 to-emerald-400",
    "bg-gradient-to-r from-blue-400 to-cyan-400",
    "bg-gradient-to-r from-red-400 to-pink-400",
    "bg-gradient-to-r from-gray-400 to-gray-100",
    "bg-gradient-to-r from-teal-400 to-cyan-400",
    "bg-gradient-to-r from-fuchsia-400 to-pink-300",
    "bg-gradient-to-r from-lime-400 to-yellow-300",
  ];
  function randomIndex() {
    return Math.floor(Math.random() * colors.length);
  }

  //Filtering post on basis of type and info
  const filteredPosts = posts.filter((post) => {
    const matchSearch = post.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchType = filterType === "" || post.postType === filterType;
    return matchSearch && matchType;
  });

  const handleAddEvent = ()=>{
    if(isAuthenticated){
      setModal(true);
      
    }
    else{
      toast.error("Please signup to proceed")

    }
  }

  return (
    <div className="min-h-screen border bg-gradient-to-r  p-6 lg:p-12  ">
      <div><Toaster
  position="top-center"
  reverseOrder={false}
/></div>
      <div className=" my-14 mx-auto container flex flex-col sm:flex-row gap-4 mb-4 items-center justify-between w-full">
        <input
          type="text"
          placeholder="Search by title..."
          className="border px-4 py-2 rounded shadow w-full sm:w-[60%]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border px-4 py-2 rounded shadow w-full sm:w-[35%]"
        >
          <option value="">All Types</option>
          <option value="question">Question</option>
          <option value="experience">Experience</option>
         
          {/* Add more types as needed */}
        </select>
        <button onClick={handleAddEvent} className="bg-pink-400 text-white hover:cursor-pointer">Add Event</button>
      </div>
      <div className="container border p-10 mx-auto my-14 grid grid-cols-1 sm:grid-cols-3 gap-4 ">
        {filteredPosts.map((post) => (
          <div
            key={post._id}
            className="w-full max-w-2xl mx-auto p-4 rounded-xl shadow-lg backdrop-blur-sm bg-white/30 border border-white/20 hover:border-black cursor-pointer hover:scale-105"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-left text-black ">
                Sent By : {post.senderName}
              </h2>
              <span className={getTag(post.tag)}>{post.tag}</span>
            </div>
            <p className={`${colors[randomIndex()]}  w-fit p-2 rounded`}>
              {post.postType}
            </p>

            <h1 className="text-center text-[14px] text-black font-semibold sm:text-xl mt-3">
              {post.title}
            </h1>
            {/* <div className="mt-5 text-xl ">{post.info}</div> */}
            <p>Replies : {post.replies.length}</p>
            <p>
              Created On :{" "}
              {(() => {
                const date = new Date(post.createdAt);
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
              })()}
            </p>

            <button className=" bg-green-400 text-white p-3 rounded-full capitalize font-bold cursor-pointer hover:scale-110 ">
              See This
            </button>
          </div>
        ))}
      </div>
      
      {modal && <AddEventModal onClose={() => setModal(false)} />}
    </div>
  );
}
