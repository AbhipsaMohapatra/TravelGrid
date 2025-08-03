import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
// import { opacity } from "html2canvas/dist/types/css/property-descriptors/opacity";

const AddEventModal = ({ onClose }) => {
  const [formdata, SetFormdata] = useState({
    title: "",
    info: "",
    tag: "",
    tagColor: "blue",
    senderName: "",
    postType: "",
  });

  const handleChange = (e) => {
    e.preventDefault();
    // {name,value} = e.target;
    SetFormdata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
 
    
    if (
      formdata.senderName.length == 0 ||
      formdata.title.length == 0 ||
      formdata.info.length == 0
    ) {
      return toast.error("Empty Feilds");
    }
    try {
      const response = await fetch(
        "http://localhost:5000/api/post/createPost",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            
          },
           credentials: "include",
          body: JSON.stringify(formdata),
        }
      );
      const data = await response.json();
      if (!data) {
        return toast.error(data.message || "Failed to create post");
      }
      toast.success("Post created successfully!");
      SetFormdata({
        title: "",
        info: "",
        tag: "",
        tagColor: "blue",
        senderName: "",
        postType: "",
      });
      onClose();
    } catch (e) {
      console.error("Error:", e);
      toast.error("Something went wrong!");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div>
          <Toaster position="top-center" reverseOrder={false} />
        </div>
        <motion.div
          className="bg-white p-6 rounded-xl w-[90%] max-w-lg shadow-lg relative"
          initial={{ scale: 0.8, opacity: 0, y: -30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: -30 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-3 text-gray-600 hover:text-red-500 text-xl font-bold"
          >
            ×
          </button>
          <h2 className="text-center text-2xl">Add New Post</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              name="senderName"
              onChange={handleChange}
              className="w-full border p-2 rounded"
              value={formdata.senderName}
              required
            />

            <select
              name="tag"
              className="w-full border p-2 rounded"
              onChange={handleChange}
              value={formdata.tag}
              required
            >
              <option value="">Select Tag</option>
              <option value="Wishlist">WishList</option>
              <option value="Travel">Travel</option>
              <option value="Pending">Pending</option>
            </select>

            <select
              name="postType"
              className="w-full border p-2 rounded"
              onChange={handleChange}
              value={formdata.postType}
              required
            >
              <option value="">Select Post Type</option>
              <option value="question">Question</option>
              <option value="experience">Experience</option>
            </select>
            <input
              type="text"
              name="title"
              placeholder="Post Title"
              className="w-full border p-2 rounded"
              onChange={handleChange}
              value={formdata.title}
              required
            />
            <textarea
              name="info"
              placeholder="Details"
              className="w-full border p-2 rounded"
              rows="4"
              onChange={handleChange}
              value={formdata.info}
              required
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-black rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Submit
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddEventModal;
