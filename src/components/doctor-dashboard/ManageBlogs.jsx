import React, { useState } from 'react';

const ManageBlogs = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageStr, setImageStr] = useState('');
    const [statusText, setStatusText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageStr(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !content || !imageStr) {
            setStatusText('Please fill out all fields and select an image.');
            return;
        }

        setIsLoading(true);
        setStatusText('Publishing blog...');

        try {
            const response = await fetch('http://localhost:5001/api/blogs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    content,
                    image: imageStr
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setStatusText('Blog published successfully!');
                setTitle('');
                setContent('');
                setImageStr('');
                // reset file input
                if (document.getElementById('blog-image')) {
                    document.getElementById('blog-image').value = '';
                }
            } else {
                setStatusText(data.message || 'Error occurred while publishing the blog.');
            }
        } catch (error) {
            setStatusText('Network or server error.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 w-full bg-white h-full flex flex-col items-center justify-start p-8 overflow-y-auto z-10 transition-colors">
            <h1 className="text-4xl font-extrabold text-[#021024] mb-8 w-full text-left">Manage Blogs</h1>

            <div className="w-full max-w-3xl bg-slate-50/70 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-[0_8px_40px_rgba(0,0,0,0.04)] text-left">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Create New Blog Post</h2>

                {statusText && (
                    <div className={`mb-6 p-4 rounded-xl text-md font-medium ${statusText.includes('success') ? 'bg-green-100/50 text-green-700' : 'bg-blue-100/50 text-blue-700'}`}>
                        {statusText}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Blog Title</label>
                        <input
                            type="text"
                            className="w-full bg-white px-5 py-4 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-clinic-500 shadow-sm transition-all focus:outline-none"
                            placeholder="Enter the title of your post..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Cover Image</label>
                        <input
                            id="blog-image"
                            type="file"
                            accept="image/*"
                            className="w-full bg-white px-5 py-4 rounded-2xl border-none ring-1 ring-slate-200 shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-clinic-50 file:text-clinic-700 hover:file:bg-clinic-100 cursor-pointer"
                            onChange={handleImageChange}
                        />
                        {imageStr && (
                            <div className="mt-4 rounded-xl overflow-hidden h-48 w-full relative">
                                <img src={imageStr} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Content</label>
                        <textarea
                            rows="8"
                            className="w-full bg-white px-5 py-4 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-clinic-500 shadow-sm transition-all focus:outline-none resize-none"
                            placeholder="Write your advice, medical tips, or insights here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#052659] text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? 'Publishing...' : 'Publish Blog Post'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ManageBlogs;
