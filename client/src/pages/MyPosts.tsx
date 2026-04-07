import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../lib/api";

interface Post {
  id: string;
  slug: string;
  title: string;
  status: string;
  createdAt: string;
  _count: { likes: number };
}

export default function MyPosts() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!user) return void navigate("/login");
    api.get("/api/posts/mine").then((r) => setPosts(r.data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">My Posts</h1>
      {posts.length === 0 && <p className="text-gray-500">No posts yet.</p>}
      <div className="space-y-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between border border-gray-200 rounded-lg p-4"
          >
            <div>
              <Link
                to={
                  post.status === "PUBLISHED"
                    ? `/post/${post.slug}`
                    : `/edit/${post.id}`
                }
                className="font-medium text-gray-900 hover:text-blue-600"
              >
                {post.title}
              </Link>
              <p className="text-xs text-gray-500 mt-1">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs ${
                    post.status === "PUBLISHED"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {post.status}
                </span>{" "}
                &middot; {new Date(post.createdAt).toLocaleDateString()}{" "}
                &middot; {post._count.likes} likes
              </p>
            </div>
            <Link
              to={`/edit/${post.id}`}
              className="text-sm text-blue-600 hover:underline"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
