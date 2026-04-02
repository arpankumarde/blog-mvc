import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import db from "@/lib/db";
import { signToken } from "@/middleware/auth";

export const register = async (req: Request, res: Response) => {
  const { email, username, password, name } = req.body;
  const existing = await db.user.findFirst({ where: { OR: [{ email }, { username }] } });
  if (existing) {
    res.status(400).json({ error: "Email or username already taken" });
    return;
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await db.user.create({ data: { email, username, password: hashed, name } });
  const { password: _, ...safe } = user;
  res.status(201).json({ ...safe, token: signToken(user.id) });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const { password: _, ...safe } = user;
  res.json({ ...safe, token: signToken(user.id) });
};

export const getProfile = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const user = await db.user.findUnique({
    where: { id },
    select: { id: true, email: true, username: true, name: true, avatar: true, createdAt: true },
  });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(user);
};
