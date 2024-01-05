import express from "express";
import router from "./router";
import morgan from "morgan";
import cors from "cors";
import { protect } from "./modules/auth";
import { createNewUser, signin } from "./handlers/user";

declare module "express-serve-static-core" {
  interface Request {
    secret?: string;
  }
}

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.secret = "doggy";
  next();
});

app.get("/", (req, res) => {
  console.log("hello from express");
  res.status(200);
  res.json({ message: "hello" });
});

app.use("/api", protect, router);
app.post("/user", createNewUser);
app.post("/signin", signin);

app.use((err, res, req, next) => {
  if (err.type === "auth") {
    res.statusCode(401).json({ message: "unauthorized" });
  } else if (err.type === "input") {
    res.statusCode(400).json({ message: "invalid input" });
  } else {
    res.statusCode(500).json({ message: "server error" });
  }
});

export default app;
