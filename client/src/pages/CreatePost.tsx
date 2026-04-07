import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../lib/api";

export default function CreatePost() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!user) navigate("/login");
    if (id) {
      api.get("/api/posts/mine").then((r) => {
        const post = r.data.find((p: { id: string }) => p.id === id);
        if (post) {
          setTitle(post.title);
          setContent(post.content);
        }
      });
    }
  }, [id]);

  const handleSubmit = async (status: string) => {
    if (id) {
      await api.put(`/api/posts/${id}`, { title, content, status });
    } else {
      await api.post("/api/posts", { title, content, status });
    }
    navigate(status === "PUBLISHED" ? "/" : "/my-posts");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">
        {id ? "Edit" : "Write"} Post
      </h1>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-blue-500"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your post..."
        rows={12}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-blue-500"
      />
      <div className="flex gap-2">
        <button
          onClick={() => handleSubmit("PUBLISHED")}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 cursor-pointer"
        >
          Publish
        </button>
        <button
          onClick={() => handleSubmit("DRAFT")}
          className="border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-50 cursor-pointer"
        >
          Save Draft
        </button>
      </div>
    </div>
  );
}
