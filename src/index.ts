import "dotenv/config";
import express from "express";
import subjectsRouter from "./routes/subject";
import cors from "cors";

const app = express();


const frontendUrl = process.env.FRONTEND_URL;
if (!frontendUrl) {
  console.warn('FRONTEND_URL is not set - CORS will reject cross-origin requests');
}
app.use(cors({
    origin: frontendUrl || false,  // false rejects all cross-origin requests if not configured
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use('/api/subjects' ,  subjectsRouter)

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on port ${process.env.PORT || 3000}: http://localhost:${process.env.PORT || 3000}`);
});
