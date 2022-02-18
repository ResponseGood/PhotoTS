import express from "express";
import * as path from "path";

import { auth } from "./routes/index";
export const app = express();

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(express.json());



app.use(express.static(path.join(__dirname, "../public")));
app.use("/", auth);
