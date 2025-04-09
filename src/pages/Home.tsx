import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url: string;
  created_at: string;
  categories: {
    name: string;
    slug: string;
  };
}

const POSTS_PER_PAGE = 6;

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const fetchPosts = async () => {
    try {
      // Get total count
      const { count } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true });

      setTotalPosts(count || 0);

      // Get paginated posts
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          *,
          categories (
            name,
            slug
          )
        `
        )
        .order("created_at", { ascending: false })
        .range(
          (currentPage - 1) * POSTS_PER_PAGE,
          currentPage * POSTS_PER_PAGE - 1
        );

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-800">Latest Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={
                post.image_url ||
                "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=800"
              }
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <Link
                to={`/category/${post.categories.slug}`}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {post.categories.name}
              </Link>
              <Link to={`/post/${post.slug}`}>
                <h2 className="mt-2 text-xl font-semibold text-gray-800 hover:text-blue-600">
                  {post.title}
                </h2>
              </Link>
              <p className="mt-2 text-gray-600 line-clamp-3">{post.content}</p>
              <div className="mt-4">
                <Link
                  to={`/post/${post.slug}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Read more →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-4 mt-8">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="flex items-center px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="flex items-center px-4 py-2 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default Home;
