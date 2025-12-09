import express from "express";
import cors from "cors";
import "dotenv/config";

import productRoutes from "./routers/product.routes.js";
import categoryRoutes from "./routers/category.routes.js";

const app = express(); // ✅ THIS WAS MISSING

app.use(
  cors({
    origin: "http://localhost:5173", // ✅ your frontend URL
    credentials: true, // ✅ allow cookies/auth
  })
);

app.use(express.json());

// ✅ ROUTES
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// ✅ START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
