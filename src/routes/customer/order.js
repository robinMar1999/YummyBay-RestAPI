import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  res.send("order route working...");
});

export default router;
