"use client";

import { useState } from "react";

export default function UploadImg() {
  const [preview, setPreview] = useState(null);
  const [ratio, setRatio] = useState("16/9");

  const ratios = [
    { label: "16:9", value: "16/9" },
    { label: "5:5", value: "5/5" },
    { label: "4:5", value: "4/5" },
    { label: "9:16", value: "9/16" },
    { label: "1:1", value: "1/1" },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  return (
    <div className="md:p-8">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Aspect Ratio
        </label>
        <select
          value={ratio}
          onChange={(e) => setRatio(e.target.value)}
          className="mt-1 block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md"
        >
          {ratios.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>
      {/* Upload File */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Upload Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1"
        />
      </div>
      {/* Preview */}
      {preview && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Preview``
          </label>
          <div
            className="mt-2 w-full bg-gray-100 overflow-hidden rounded-lg"
            style={{ aspectRatio: ratio }}
          >
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}
