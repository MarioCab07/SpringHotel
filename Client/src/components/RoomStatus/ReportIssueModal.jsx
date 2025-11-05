import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaChevronLeft } from "react-icons/fa";

const ReportIssueModal = ({ 
  isOpen,
  onClose,
  onSubmit,
  item,
 }) => {
    const [text, setText] = useState("");

    useEffect(() => {
  if (isOpen && item) {
    setText(item.comments || "");
  }
  }, [isOpen, item])

    if (!isOpen || !item) return null;


    return createPortal(
        <div className="fixed inset-0 z-50 flex">
        <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        />

        <div className="relative ml-auto w-1/2 h-full bg-white shadow-xl flex flex-col">
        <header className="bg-[#172A45] text-white p-4 flex items-center justify-between">
          <button onClick={onClose} className="p-2">
            <FaChevronLeft size={18} />
          </button>
          <h2 className="font-serif text-lg">Report Issue</h2>
          <button
            onClick={() => {
              onSubmit(text);
              setText("");
            }}
            className="px-4 py-1 bg-[#f2789f] hover:bg-[#e76b91] rounded text-sm"
          >
            Save
          </button>
        </header>

        <div className="p-6 flex-1 overflow-auto">
          <label className="block text-sm text-gray-700 mb-2">
            Report problem:
          </label>
          <textarea
            className="w-full h-48 p-3 border border-gray-300 rounded resize-none focus:outline-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </div>
    </div>,
    document.body

    );
}

export default ReportIssueModal;