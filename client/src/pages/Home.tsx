import { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../lib/api";

interface Post {
  id: string;
  slug: string;
  title: string;
  content: string;
  publishedAt: string;
  author: { username: string; name: string | null };
  _count: { likes: number };
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    api.get("/api/posts").then((r) => setPosts(r.data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Latest Posts</h1>
      {posts.length === 0 && <p className="text-gray-500">No posts yet.</p>}
      <div className="space-y-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/post/${post.slug}`}
            className="block border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              {post.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {post.author.name || post.author.username} &middot;{" "}
              {new Date(post.publishedAt).toLocaleDateString()} &middot;{" "}
              {post._count.likes} likes
            </p>
            <p className="text-gray-600 mt-2 line-clamp-2">{post.content}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
