import React from 'react';

const BlogSection = () => {
  const posts = [
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
      image: "https://www.docwirenews.com/cdn-cgi/image/w=400,h=280,q=85,f=auto,fit=scale-down,width=828/https://mumcdnstorage.blob.core.windows.net/dwnews/2020/10/Specialist-Care-May-Reduce-Healthcare-Resource-Utilization.jpg",
      category: "Preventive Care",
      date: "Oct 05, 2026"
    }
  ];

  return (
    <section id="blog" className="w-full max-w-7xl mx-auto px-8 md:px-16 py-24">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Health Insights & Wellness Tips</h2>
        <p className="text-slate-500 text-sm md:text-base leading-relaxed">
          Read the latest medical advice and wellness strategies written directly by Dr. [Doctor Name].
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post, idx) => (
          <div key={idx} className="bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer flex flex-col">
            <div className="h-48 overflow-hidden relative">
               <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6 flex flex-col grow">
              <div className="flex items-center gap-4 text-xs font-medium mb-3">
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full">{post.category}</span>
                <span className="text-slate-400">{post.date}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                {post.title}
              </h3>
              <div className="mt-auto text-blue-600 font-medium text-sm flex items-center gap-2">
                Read Article
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;
