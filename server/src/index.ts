import express from "express";
import cors from "cors";
import { config } from "dotenv";
import userRoutes from "@/routes/user.routes";
import postRoutes from "@/routes/post.routes";

const app = express();
config({ quiet: true });
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Server healthy!" });
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(port, () => {
  console.log(`Server is running at Port ${port}`);
});
