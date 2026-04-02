import type { Response } from "express";
import type { AuthRequest } from "@/middleware/auth";
import db from "@/lib/db";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") +
  "-" +
  Date.now().toString(36);

export const createPost = async (req: AuthRequest, res: Response) => {
  const { title, content, banner, status } = req.body;
  const post = await db.post.create({
    data: {
      title,
      content,
      banner,
      slug: slugify(title),
      status: status || "DRAFT",
      publishedAt: status === "PUBLISHED" ? new Date() : null,
      authorId: req.userId!,
    },
    include: { author: { select: { id: true, username: true, name: true } } },
  });
  res.status(201).json(post);
};

export const getPosts = async (_req: AuthRequest, res: Response) => {
  const posts = await db.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: {
      author: { select: { id: true, username: true, name: true } },
      _count: { select: { likes: true } },
    },
  });
  res.json(posts);
};

export const getPost = async (req: AuthRequest, res: Response) => {
  const slug = req.params.slug as string;
  const post = await db.post.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, username: true, name: true } },
      _count: { select: { likes: true } },
      likes: { select: { userId: true } },
    },
  });
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  await db.post.update({ where: { id: post.id }, data: { readCount: { increment: 1 } } });
  res.json(post);
};

export const getUserPosts = async (req: AuthRequest, res: Response) => {
  const posts = await db.post.findMany({
    where: { authorId: req.userId! },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { likes: true } } },
  });
  res.json(posts);
};

export const updatePost = async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { title, content, banner, status } = req.body;
  const existing = await db.post.findUnique({ where: { id } });
  if (!existing || existing.authorId !== req.userId) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  const post = await db.post.update({
    where: { id },
    data: {
      title,
      content,
      banner,
      status,
      ...(status === "PUBLISHED" && !existing.publishedAt ? { publishedAt: new Date() } : {}),
    },
    include: { author: { select: { id: true, username: true, name: true } } },
  });
  res.json(post);
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const existing = await db.post.findUnique({ where: { id } });
  if (!existing || existing.authorId !== req.userId) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  await db.post.delete({ where: { id } });
  res.json({ success: true });
};

export const toggleLike = async (req: AuthRequest, res: Response) => {
  const postId = req.params.id as string;
  const userId = req.userId!;
  const existing = await db.like.findUnique({
    where: { userId_postId: { userId, postId } },
  });
  if (existing) {
    await db.like.delete({ where: { userId_postId: { userId, postId } } });
    res.json({ liked: false });
  } else {
    await db.like.create({ data: { userId, postId } });
    res.json({ liked: true });
  }
};
