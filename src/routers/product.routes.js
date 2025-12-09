import express from "express";
import { prisma } from "../lib/prisma.js";
import { supabase } from "../lib/supabase.js";
import { upload } from "../middlewares/upload.js";
// import { prisma } from "../lib/prisma.js";

const router = express.Router();

// CREATE PRODUCT
router.post("/", async (req, res) => {
  try {
    const { name, description, price, stock, imageUrl, categoryId } = req.body;

    const product = await prisma.product.create({
      data: { name, description, price, stock, imageUrl, categoryId },
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Product creation failed" });
  }
});

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  res.json(products);
});

router.post("/admin", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, stock, categoryId } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "Image is required" });

    // ✅ Upload to Supabase Storage
    const fileName = `products/${Date.now()}-${file.originalname}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) throw uploadError;

    // ✅ Get public URL
    const { data: publicUrl } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    // ✅ Save product in DB
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        imageUrl: publicUrl.publicUrl,
        categoryId,
      },
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("ADMIN PRODUCT ERROR:", err);
    res.status(500).json({ error: "Product creation failed" });
  }
});

export default router;
