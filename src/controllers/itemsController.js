const { db } = require("../config/firebase");
const collection = db.collection("items");

const getImageValue = (body) => body.imageBase64 || body.image || body.photo || null;

const uploadToImgbb = async (image) => {
  const apiKey = process.env.IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error("Falta configurar IMGBB_API_KEY");
  }

  if (typeof image !== "string" || !image.trim()) {
    throw new Error("La imagen es requerida");
  }

  const imageValue = /^https?:\/\//i.test(image)
    ? image
    : image.replace(/^data:[^;]+;base64,/, "");
  const form = new URLSearchParams();
  form.append("image", imageValue);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error?.message || "No se pudo cargar la imagen en ImgBB");
  }

  return result.data.url;
};

const getItems = async (req, res) => {
  try {
    const querySnapshot = await collection.get();
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(items);
  } catch (error) {
    console.error("Error al intentar obtener items:", error);
    return res.status(500).json({ message: "Error al intentar obtener items" });
  }
};

const createItems = async (req, res) => {
  try {
    const image = getImageValue(req.body);
    const imageUrl = await uploadToImgbb(image);

    const {
      image: _image,
      imageBase64: _imageBase64,
      photo: _photo,
      ...itemData
    } = req.body;

    const item = {
      ...itemData,
      imageUrl,
      createdAt: new Date(),
    };

    const docRef = await collection.add(item);

    return res.status(201).json({
      id: docRef.id,
      ...item,
      createdAt: item.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Error al intentar crear item:", error);
    return res.status(400).json({
      message: error.message || "Error al intentar crear item",
    });
  }
};

module.exports = { getItems, createItems };
