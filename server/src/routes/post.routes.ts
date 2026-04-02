import { Router } from "express";
import { auth } from "@/middleware/auth";
import {
  createPost,
  getPosts,
  getPost,
  getUserPosts,
  updatePost,
  deletePost,
  toggleLike,
} from "@/controllers/post.controller";

const router = Router();

router.get("/", getPosts);
router.get("/mine", auth, getUserPosts);
router.get("/:slug", getPost);
router.post("/", auth, createPost);
router.put("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
router.post("/:id/like", auth, toggleLike);

export default router;
