import express from "express";
import Barcode from "../models/Barcode.js";
import { authApiKey } from "../middleware/authApiKey.js";
import upload from "../middleware/upload.js";
import { body, validationResult } from "express-validator";
import mongoose from "mongoose"; // <-- agregado para validar ObjectId

const router = express.Router();

/* --- RUTAS FIJAS ANTES DE LA RUTA POR ID --- */

// Top barcodes
router.get("/top", authApiKey, async (req, res) => {
  try {
    const barcodes = await Barcode.find().sort({ scans: -1 }).limit(10);
    res.json(barcodes);
  } catch (error) {
    console.error("TOP ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// Stats globales
router.get("/stats", authApiKey, async (req, res) => {
  try {
    const totalBarcodes = await Barcode.countDocuments();
    const totalScansAgg = await Barcode.aggregate([
      { $group: { _id: null, scans: { $sum: "$scans" } } }
    ]);
    const totalScans = totalScansAgg[0]?.scans || 0;
    const latest = await Barcode.find().sort({ createdAt: -1 }).limit(5);

    res.json({ totalBarcodes, totalScans, latest });
  } catch (error) {
    console.error("STATS ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// Buscar por código exacto
router.get("/search/:barcode", authApiKey, async (req, res) => {
  try {
    const { barcode } = req.params;
    const result = await Barcode.findOne({ barcode });
    if (!result) {
      return res.status(404).json({ error: "Barcode no encontrado" });
    }
    res.json(result);
  } catch (error) {
    console.error("SEARCH ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// Últimos barcodes
router.get("/latest", authApiKey, async (req, res) => {
  try {
    const latestBarcodes = await Barcode.find().sort({ createdAt: -1 }).limit(10);
    res.json(latestBarcodes);
  } catch (error) {
    console.error("LATEST ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// Conteo total
router.get("/count", authApiKey, async (req, res) => {
  try {
    const total = await Barcode.countDocuments();
    res.json({ total });
  } catch (error) {
    console.error("COUNT ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

/* --- RUTA GENERAL PARA TODOS LOS BARCODES --- */
router.get("/", authApiKey, async (req, res) => {
  try {
    const barcodes = await Barcode.find();
    res.json(barcodes);
  } catch (error) {
    console.error("GET ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

/* --- RUTA POR ID --- */
router.get("/:id", authApiKey, async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const barcode = await Barcode.findByIdAndUpdate(
      id,
      { $inc: { scans: 1 } },
      { new: true }
    );
    if (!barcode) {
      return res.status(404).json({ error: "Barcode no encontrado" });
    }
    res.json(barcode);
  } catch (error) {
    console.error("GET BY ID ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

/* --- POST --- */
router.post(
  "/",
  authApiKey,
  upload.single("image"), // <-- primero multer
  [
    body("barcode")
      .notEmpty().withMessage("El campo 'barcode' es requerido")
      .isString().withMessage("El código debe ser texto"),
    body("name")
      .optional()
      .isString().withMessage("El nombre debe ser texto")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { barcode, name } = req.body;
      const newBarcode = await Barcode.create({
        barcode,
        name,
        imageUrl:  req.file?.secure_url || req.file?.path,
      });
      res.status(201).json(newBarcode);
    } catch (error) {
      console.error("CONTROLLER ERROR:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

/* --- PUT --- */
router.put(
  "/:id",
  authApiKey,
  upload.single("image"), // <-- primero multer
  [
    body("barcode")
      .optional()
      .isString().withMessage("El código debe ser texto"),
    body("name")
      .optional()
      .isString().withMessage("El nombre debe ser texto")
  ],
  async (req, res) => {
    console.log("BODY recibido:", req.body);
    console.log("FILE recibido:", req.file);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const { barcode, name } = req.body;

      // Construimos dinámicamente el objeto de actualización
      const updateData = {};
      if (barcode) updateData.barcode = barcode;
      if (name) updateData.name = name;
      if (req.file) updateData.imageUrl =  req.file?.secure_url || req.file?.path;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: "Debes enviar 'barcode', 'name' o 'image' para actualizar" });
      }

      const updatedBarcode = await Barcode.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedBarcode) {
        return res.status(404).json({ error: "Barcode no encontrado" });
      }

      res.json(updatedBarcode);
    } catch (error) {
      console.error("PUT ERROR:", error);
      res.status(500).json({ error: error.message });
    }
  }
);
/* --- DELETE --- */
router.delete("/:id", authApiKey, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const deletedBarcode = await Barcode.findByIdAndDelete(id);
    if (!deletedBarcode) {
      return res.status(404).json({ error: "Barcode no encontrado" });
    }
    res.json({ message: "Barcode eliminado correctamente", deletedBarcode });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
  
});
router.post("/fix-urls", async (req, res) => {
  try {
    const result = await Barcode.updateMany(
      { imageUrl: /^\/https/ },
      [
        {
          $set: {
            imageUrl: {
              $substr: ["$imageUrl", 1, { $strLenCP: "$imageUrl" }]
            }
          }
        }
      ]
    );
    res.json({ updated: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



export default router;
