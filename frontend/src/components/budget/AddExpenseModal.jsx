import React, { useState, useEffect } from "react";
import { createExpense } from "../../services/budgetService";
import "../../assets/styles/modals.css";
import Tesseract from "tesseract.js";

const AddExpenseModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({ category: "", amount: "", date: "" });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const processImage = async () => {
    if (!image) return;

    setIsProcessing(true);
    try {
      const {
        data: { text },
      } = await Tesseract.recognize(image, "eng", {
        logger: (m) => console.log(m),
      });

      console.log("OCR Result:\n", text); // Debug log

      const extractedData = extractDataFromText(text);
      setForm((prev) => ({
        ...prev,
        ...extractedData,
      }));
    } catch (error) {
      console.error("OCR Error:", error);
      alert("Failed to process image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const extractDataFromText = (text) => {
    const lines = text.split("\n").map((line) => line.toLowerCase().trim());
    let category = "";
    let amount = "";
    let date = "";

    for (const line of lines) {
      // Category detection
      if (!category && /(food|grocery|restaurant|shopping|travel|rent|bill)/i.test(line)) {
        category = line.match(/(food|grocery|restaurant|shopping|travel|rent|bill)/i)[0];
      }

      // Amount detection
      if (!amount && /\b\d+(\.\d{1,2})?\b/.test(line)) {
        amount = line.match(/\b\d+(\.\d{1,2})?\b/)[0];
      }

      // Date detection (dd/mm/yyyy or dd-mm-yyyy)
      if (!date && /\b\d{2}[\/\-]\d{2}[\/\-]\d{4}\b/.test(line)) {
        const dateMatch = line.match(/\b\d{2}[\/\-]\d{2}[\/\-]\d{4}\b/)[0];
        date = formatDate(dateMatch);
      }
    }

    return { category, amount, date };
  };

  const formatDate = (dateStr) => {
    const delimiter = dateStr.includes("/") ? "/" : "-";
    const [day, month, year] = dateStr.split(delimiter);
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const handleSubmit = async () => {
    await createExpense(form);
    onSuccess();
    onClose();
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-lg font-bold mb-2">Add Expense</h2>

        <div className="mb-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Uploaded Preview"
                className="w-full h-auto max-h-48 object-contain rounded-md"
              />
            </div>
          )}
          <button
            onClick={processImage}
            disabled={!image || isProcessing}
            className={`mt-2 w-full btn-primary ${
              isProcessing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isProcessing ? "Processing..." : "Extract from Image"}
          </button>
        </div>

        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-finance-primary"
          placeholder="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
        />
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-finance-primary"
          placeholder="Amount"
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
        />
        <input
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-finance-primary"
          placeholder="Date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
        />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={isProcessing}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExpenseModal;