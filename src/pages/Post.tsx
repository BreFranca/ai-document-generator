import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface Post {
  id: string;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
  categories: {
    name: string;
    slug: string;
  };
}

const Post = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
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
        .eq("slug", slug)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800">Post not found</h1>
      </div>
    );
  }

  return (
    <article>
      {post && (
        <>
          <h1>{post.title}</h1>
          <time dateTime={post.created_at}>
            {new Date(post.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <img src={post.image_url} alt={post.title} loading="lazy" />
          <div>{post.content}</div>
          <div>Category: {post.categories.name}</div>
        </>
      )}
    </article>
  );
};

export default Post;
