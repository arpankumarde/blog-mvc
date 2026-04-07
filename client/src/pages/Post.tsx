import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import api from "../lib/api";

interface PostData {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  readCount: number;
  author: { id: string; username: string; name: string | null };
  _count: { likes: number };
  likes: { userId: string }[];
}

export default function Post() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostData | null>(null);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchPost = () =>
    api.get(`/api/posts/${slug}`).then((r) => setPost(r.data));

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const handleLike = async () => {
    if (!user) return navigate("/login");
    await api.post(`/api/posts/${post!.id}/like`);
    fetchPost();
  };

  const handleDelete = async () => {
    if (confirm("Delete this post?")) {
      await api.delete(`/api/posts/${post!.id}`);
      navigate("/");
    }
  };

  if (!post)
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-gray-500">
        Loading...
      </div>
    );

  const liked = user && post.likes.some((l) => l.userId === user.id);
  const isAuthor = user?.id === post.author.id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
      <p className="text-sm text-gray-500 mt-2">
        {post.author.name || post.author.username} &middot;{" "}
        {new Date(post.publishedAt).toLocaleDateString()} &middot;{" "}
        {post.readCount} reads
      </p>

      {isAuthor && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => navigate(`/edit/${post.id}`)}
            className="text-sm text-blue-600 hover:underline cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-sm text-red-600 hover:underline cursor-pointer"
          >
            Delete
          </button>
        </div>
      )}

      <div className="mt-6 text-gray-700 whitespace-pre-wrap leading-relaxed">
        {post.content}
      </div>

      <button
        onClick={handleLike}
        className={`mt-6 px-4 py-2 rounded text-sm cursor-pointer ${
          liked
            ? "bg-blue-600 text-white"
            : "border border-blue-600 text-blue-600"
        }`}
      >
        {liked ? "Liked" : "Like"} ({post._count.likes})
      </button>
    </div>
  );
}
