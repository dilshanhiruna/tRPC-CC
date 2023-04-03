import express from "express";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:4200",
  })
);
app.use(express.json());

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
