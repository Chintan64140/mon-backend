import express from "express";
import { prisma } from "../lib/prisma.js";

const router = express.Router();

// ✅ CREATE CATEGORY (with imageUrl)
router.post("/", async (req, res) => {
  try {
    const { name, slug, imageUrl } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        imageUrl, // ✅ now saved correctly
      },
    });

    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Category creation failed" });
  }
});

// ✅ GET ALL CATEGORIES
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// ✅ DELETE CATEGORY ✅✅✅ (FIX FOR YOUR 404 ERROR)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.category.delete({
      where: { id },
    });

    res.json({ success: true, message: "Category Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;
