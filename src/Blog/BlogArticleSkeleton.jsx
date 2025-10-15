import BlogPageArticle from "./BlogPageArticle";
import BlogArticleSkeleton from "./BlogArticleSkeleton.jsx";

const BlogArticleSkeleton = () => {
  if (!blog)
    return <BlogArticleSkeleton />;
  return (
    <div className="min-h-screen pt-30 bg-[#111] text-white px-6 py-10 md:px-24 animate-pulse">
      {/* Breadcrumb */}
      <div className="h-4 w-1/3 bg-gray-700 rounded mb-6"></div>

      {/* Back link */}
      <div className="h-4 w-24 bg-gray-700 rounded mb-6"></div>

      {/* Banner */}
      <div className="bg-[#0d0d0d] rounded-2xl overflow-hidden border border-white/10">
        <div className="w-full h-72 bg-gray-800"></div>
        <div className="p-6 space-y-4">
          <div className="h-5 w-20 bg-gray-700 rounded-full"></div>
          <div className="h-8 w-3/4 bg-gray-700 rounded"></div>
          <div className="flex gap-4 mt-4">
            <div className="h-4 w-24 bg-gray-700 rounded"></div>
            <div className="h-4 w-20 bg-gray-700 rounded"></div>
            <div className="h-4 w-28 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>

      {/* Content blocks */}
      <div className="mt-6 bg-[#0d0d0d] p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="h-5 w-1/3 bg-gray-700 rounded"></div>
        <div className="h-4 w-full bg-gray-700 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-700 rounded"></div>
        <div className="h-4 w-2/3 bg-gray-700 rounded"></div>
      </div>

      {/* Share */}
      <div className="mt-8 bg-[#0d0d0d] p-6 rounded-2xl border border-white/10">
        <div className="h-5 w-40 bg-gray-700 rounded mb-4"></div>
        <div className="flex gap-4">
          <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
          <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
          <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
          <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export default BlogArticleSkeleton;
