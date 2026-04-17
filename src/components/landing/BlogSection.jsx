import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const BlogSection = () => {
  const [dbPosts, setDbPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/blogs');
        const data = await response.json();
        if (response.ok && data.success) {
          setDbPosts(data.blogs);
        }
      } catch (err) {
        console.error("Failed to load blogs", err);
      }
    };
    fetchBlogs();
  }, []);

  const staticPosts = [
    {
      title: "5 Simple Daily Habits to Boost Your Immune System Naturally",
      image: "https://assets.clevelandclinic.org/transform/LargeFeatureImage/de3bda53-59e5-4342-a45c-e64c72c1207d/foods-with-vitamins-1182014891",
      category: "Wellness",
      date: "Oct 15, 2026"
    },
    {
      title: "Understanding Your Blood Pressure: What the Numbers Actually Mean",
      image: "https://static.toiimg.com/thumb/msid-123432364,width-1280,height-720,resizemode-4/123432364.jpg",
      category: "Health Tips",
      date: "Oct 12, 2026"
    },
    {
      title: "Why You Shouldn't Skip Your Annual Medical Check-up",
      image: "https://cdn.openviowebsites.com/source/sites/5835a1c0-9e3c-4d5e-b068-5c4d69b63968/images/26a01d7d-6cbd-422a-bfe5-dc7ddaa0be2c_preventive-health-checkup.png",
      category: "Preventive Care",
      date: "Oct 05, 2026"
    },
    {
      title: "How Sleep Affects Your Long-term Health and Wellness",
      image: "https://www.sleepfoundation.org/wp-content/uploads/2020/03/sleep-timeline.jpg",
      category: "Wellness",
      date: "Oct 01, 2026"
    }
  ];

  const allPosts = [...dbPosts, ...staticPosts];
  const displayedPosts = showAll ? allPosts : allPosts.slice(0, 3);

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2, delayChildren: 0.2 } 
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section id="blog" className="w-full max-w-7xl mx-auto px-8 md:px-16 py-24">
      <motion.div 
        className="text-center max-w-2xl mx-auto mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={headerVariants}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Health Insights & Wellness Tips</h2>
        <p className="text-slate-500 text-sm md:text-base leading-relaxed">
          Read the latest medical advice and wellness strategies written directly by Dr. MV Sharma.
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        {displayedPosts.map((post, idx) => {
          const dateStr = post.createdAt ? new Date(post.createdAt).toLocaleDateString() : post.date;
          const categoryStr = post.category || "Health Updates";
          return (
          <motion.div 
            key={idx} 
            variants={cardVariants}
            onClick={() => setSelectedPost({...post, category: categoryStr, displayDate: dateStr})}
            className="bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer flex flex-col"
          >
            <div className="h-48 overflow-hidden relative">
               <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
            </div>
            <div className="p-6 flex flex-col grow">
              <div className="flex items-center gap-4 text-xs font-medium mb-3">
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full">{categoryStr}</span>
                <span className="text-slate-400">{dateStr}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                {post.title}
              </h3>
              <div className="mt-auto text-blue-600 font-medium text-sm flex items-center gap-2">
                Read Article
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </motion.div>
          );
        })}
      </motion.div>

      {allPosts.length > 3 && (
        <motion.div 
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <button 
            onClick={() => setShowAll(!showAll)}
            className="px-8 py-3.5 bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white font-bold rounded-full transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
          >
            {showAll ? 'View Less' : 'Read More Blogs'}
            {!showAll && <span className="group-hover:translate-x-1 transition-transform">→</span>}
          </button>
        </motion.div>
      )}

      {/* Modal for Reading Blog */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-3xl max-h-[85vh] rounded-4xl shadow-2xl flex flex-col overflow-hidden relative"
            >
              <button 
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur text-slate-800 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors shadow-sm"
              >
                ✕
              </button>
              
              <div className="w-full h-64 md:h-80 relative shrink-0">
                <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white w-full">
                  <div className="flex gap-3 mb-3">
                    <span className="bg-blue-600 px-3 py-1 text-xs font-bold rounded-full">{selectedPost.category}</span>
                    <span className="text-white/80 text-sm font-medium">{selectedPost.displayDate}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold leading-tight">{selectedPost.title}</h2>
                </div>
              </div>
              
              <div className="p-6 md:p-8 overflow-y-auto w-full text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                {selectedPost.content || "Content coming soon..."}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default BlogSection;
