import React, { useEffect, useState } from "react";
import api from "../services/api";

const AllProductsByCategory: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (err) {
        setProducts([]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Group products by category
  const grouped = products.reduce((acc: Record<string, any[]>, product) => {
    const cat = product.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: 1000, margin: "2rem auto", padding: "1rem" }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 32, color: "#7c5a1e" }}>All Products by Category</h1>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <table style={{ width: "100%", background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden", borderCollapse: "separate", borderSpacing: 0 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: 16, fontWeight: 700, color: "#7c5a1e", fontSize: 18 }}>Image</th>
              <th style={{ textAlign: "left", padding: 16, fontWeight: 700, color: "#7c5a1e", fontSize: 18 }}>Name</th>
              <th style={{ textAlign: "left", padding: 16, fontWeight: 700, color: "#7c5a1e", fontSize: 18 }}>Category</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(grouped).map(([cat, items]) => (
              <React.Fragment key={cat}>
                {items.map((product, idx) => (
                  <tr key={product._id} style={{ borderTop: idx === 0 ? "2px solid #efd1a1" : undefined }}>
                    <td style={{ padding: 16 }}>
                      <img src={product.images?.[0] || "/images/logo.png"} alt={product.name} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }} />
                    </td>
                    <td style={{ padding: 16 }}>{product.name}</td>
                    <td style={{ padding: 16 }}>{cat}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllProductsByCategory; 