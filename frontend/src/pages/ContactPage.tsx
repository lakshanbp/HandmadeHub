import React, { useState } from "react";

const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", padding: "1.5rem", background: "#fff", borderRadius: 18, boxShadow: "0 2px 16px rgba(239,209,161,0.13)" }}>
      <h1 style={{ color: "#7c5a1e", fontWeight: 800, fontSize: 32, marginBottom: 24 }}>Contact Us</h1>
      <div style={{ marginBottom: 32, color: "#7c5a1e", fontWeight: 500 }}>
        <div>Email: <a href="mailto:support@handmadehub.com" style={{ color: "#7c5a1e" }}>support@handmadehub.com</a></div>
        <div>Phone: <a href="tel:+1234567890" style={{ color: "#7c5a1e" }}>+1 (234) 567-890</a></div>
        <div>Address: 123 Artisan Lane, Craftsville, USA</div>
      </div>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ padding: "1rem", borderRadius: 10, border: "1px solid #efd1a1", fontSize: 16 }}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ padding: "1rem", borderRadius: 10, border: "1px solid #efd1a1", fontSize: 16 }}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          style={{ padding: "1rem", borderRadius: 10, border: "1px solid #efd1a1", fontSize: 16 }}
        />
        <button
          type="submit"
          style={{
            background: "#efd1a1",
            color: "#7c5a1e",
            fontWeight: 700,
            border: "none",
            borderRadius: 12,
            padding: "1rem 0",
            fontSize: 18,
            cursor: "pointer",
            marginTop: 8,
            boxShadow: "0 2px 8px #efd1a1",
            transition: "background 0.2s"
          }}
        >
          Send Message
        </button>
        {submitted && <div style={{ color: "#388e3c", fontWeight: 600, marginTop: 8 }}>Thank you! Your message has been sent.</div>}
      </form>
    </div>
  );
};

export default ContactPage; 