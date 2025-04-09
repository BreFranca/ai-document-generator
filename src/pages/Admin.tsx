import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import RichTextEditor from "../components/RichTextEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
}

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category_id: "",
  });

  useEffect(() => {
    if (!user?.is_admin) {
      navigate("/");
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [postsData, categoriesData] = await Promise.all([
        supabase
          .from("posts")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase.from("categories").select("*").order("name"),
      ]);

      if (postsData.error) throw postsData.error;
      if (categoriesData.error) throw categoriesData.error;

      setPosts(postsData.data || []);
      setCategories(categoriesData.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Only insert the necessary post data without querying users table
      const { error } = await supabase.from("posts").insert({
        title: formData.title,
        content: formData.content,
        category_id: formData.category_id,
        slug,
        author_id: user?.id,
      });

      if (error) throw error;

      setFormData({ title: "", content: "", category_id: "" });
      fetchData();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>

      <div className="bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-card-foreground mb-4">
          Create New Post
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-medium text-foreground"
            >
              Title
            </label>
            <Input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="category"
              className="text-sm font-medium text-foreground"
            >
              Category
            </label>
            <Select
              value={formData.category_id}
              onValueChange={(value) =>
                setFormData({ ...formData, category_id: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="content"
              className="text-sm font-medium text-foreground"
            >
              Content
            </label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
            />
          </div>

          <Button type="submit">Create Post</Button>
        </form>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-card-foreground mb-4">
          Recent Posts
        </h2>
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="border-b pb-4">
              <h3 className="text-lg font-medium text-card-foreground">
                {post.title}
              </h3>
              <div
                className="text-muted-foreground mt-1 line-clamp-2"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
