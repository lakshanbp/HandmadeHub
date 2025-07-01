import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const categoryImages: Record<string, string> = {
  homeware: "/images/image_1.jpg",
  jewelry: "/images/image_2.jpg",
  art: "/images/image_3.jpg",
  // Add more categories and images as needed
};

const categoryDescriptions: Record<string, string> = {
  homeware: "Beautiful handmade items for your home.",
  jewelry: "Unique, artisan-crafted jewelry pieces.",
  art: "Original artworks from talented creators.",
  // Add more categories and descriptions as needed
};

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products?category=${categoryName}`);
        setProducts(res.data);
      } catch (err) {
        setProducts([]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [categoryName]);

  const image = categoryImages[categoryName || ""] || "/images/logo.png";
  const description = categoryDescriptions[categoryName || ""] || "Discover unique handmade products in this category.";

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1rem", background: "#fafafa", minHeight: "100vh" }}>
      <div style={{
        background: "#efd1a1",
        borderRadius: 24,
        padding: "2rem 2rem 1.5rem 2rem",
        display: "flex",
        alignItems: "center",
        gap: 32,
        marginBottom: 48,
        boxShadow: "0 6px 32px 0 rgba(239,209,161,0.18)",
        border: "none"
      }}>
        <img src={image} alt={categoryName} style={{ width: 110, height: 110, objectFit: "cover", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", background: "#fff" }} />
        <div>
          <h1 style={{ fontSize: 40, fontWeight: 800, margin: 0, color: "#7c5a1e", letterSpacing: "-1px" }}>{(categoryName ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1) : "Category")}</h1>
          <p style={{ fontSize: 20, color: "#444", marginTop: 12, fontWeight: 500 }}>{description}</p>
        </div>
      </div>
      <button
        onClick={() => navigate("/")}
        style={{
          background: "#efd1a1",
          color: "#7c5a1e",
          fontWeight: 700,
          border: "none",
          borderRadius: 14,
          padding: "0.9rem 2.2rem",
          marginBottom: 40,
          cursor: "pointer",
          fontSize: 18,
          boxShadow: "0 2px 12px 0 rgba(239,209,161,0.18)",
          transition: "background 0.2s, box-shadow 0.2s",
          outline: "none"
        }}
        onMouseOver={e => (e.currentTarget.style.background = "#e0b97c")}
        onMouseOut={e => (e.currentTarget.style.background = "#efd1a1")}
      >
        ← Back to Home
      </button>
      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
          {products.map(product => (
            <div key={product._id} style={{ width: 220, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", padding: 16, cursor: "pointer" }} onClick={() => navigate(`/product/${product._id}`)}>
              <img src={product.images?.[0] || "/images/logo.png"} alt={product.name} style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8, marginBottom: 8 }} />
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>{product.name}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage; 