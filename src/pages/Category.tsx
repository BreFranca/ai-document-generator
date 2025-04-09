import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url: string;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const POSTS_PER_PAGE = 6;

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    if (slug) {
      fetchCategoryAndPosts();
    }
  }, [slug, currentPage]);

  const fetchCategoryAndPosts = async () => {
    try {
      // Fetch category
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .single();

      if (categoryError) throw categoryError;
      setCategory(categoryData);

      // Get total count for this category
      const { count } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("category_id", categoryData.id);

      setTotalPosts(count || 0);

      // Fetch paginated posts in this category
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .eq("category_id", categoryData.id)
        .order("created_at", { ascending: false })
        .range(
          (currentPage - 1) * POSTS_PER_PAGE,
          currentPage * POSTS_PER_PAGE - 1
        );

      if (postsError) throw postsError;
      setPosts(postsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
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

  if (!category) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800">Category not found</h1>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-800">{category.name}</h1>
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
              <Link to={`/post/${post.slug}`}>
                <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-600">
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

export default Category;
