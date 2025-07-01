import React, { useState } from "react";

const faqs = [
  {
    question: "How do I place an order?",
    answer: "Browse products, add them to your cart, and proceed to checkout. You can pay securely online."
  },
  {
    question: "Can I contact the artisan directly?",
    answer: "Yes! Each product page has a link to the artisan's shop where you can message them directly."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for unused items in their original packaging. Please contact support for assistance."
  },
  {
    question: "How are products shipped?",
    answer: "Artisans ship products directly to you. Shipping times and costs may vary by seller and location."
  },
  {
    question: "How do I become a seller?",
    answer: "Apply to become an artisan from your account dashboard. Our team will review your application within 2-3 business days."
  }
];

const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", padding: "1.5rem", background: "#fff", borderRadius: 18, boxShadow: "0 2px 16px rgba(239,209,161,0.13)" }}>
      <h1 style={{ color: "#7c5a1e", fontWeight: 800, fontSize: 32, marginBottom: 32 }}>Frequently Asked Questions</h1>
      {faqs.map((faq, idx) => (
        <div key={idx} style={{ marginBottom: 18, borderRadius: 12, overflow: "hidden", boxShadow: openIndex === idx ? "0 2px 8px #efd1a1" : undefined }}>
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            style={{
              width: "100%",
              textAlign: "left",
              background: openIndex === idx ? "#efd1a1" : "#f8fafc",
              color: "#7c5a1e",
              fontWeight: 700,
              fontSize: 18,
              padding: "1.1rem 1.2rem",
              border: "none",
              outline: "none",
              cursor: "pointer",
              borderBottom: openIndex === idx ? "1px solid #e0b97c" : "1px solid #eee",
              transition: "background 0.2s"
            }}
          >
            {faq.question}
            <span style={{ float: "right", fontWeight: 400 }}>{openIndex === idx ? "-" : "+"}</span>
          </button>
          {openIndex === idx && (
            <div style={{ background: "#fff8ec", color: "#5a4320", padding: "1rem 1.2rem", fontSize: 16, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQPage; 