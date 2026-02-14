import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createComplaint } from "../utils/api";

const RaiseIssue = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    locationText: "",
    category: "Roads",
    coords: null,
    proofName: "",
    photoData: "",
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);

  // 🔥 Auto detect current location
  const detectLocation = () => {
    if (!navigator.geolocation) return;

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
          );
          const data = await res.json();

          setForm((f) => ({
            ...f,
            locationText: data.display_name || `${lat}, ${lng}`,
            coords: [lat, lng],
          }));
        } catch {
          setForm((f) => ({
            ...f,
            locationText: `${lat}, ${lng}`,
            coords: [lat, lng],
          }));
        }

        setLocating(false);
      },
      () => setLocating(false)
    );
  };

  // 🔥 Convert typed address → coordinates
  const geocodeAddress = async (address) => {
    if (!address) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);

        setForm((f) => ({
          ...f,
          coords: [lat, lon],
        }));
      }
    } catch (err) {
      console.log("Geocode failed");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLocationBlur = () => {
    geocodeAddress(form.locationText);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.coords) {
      alert("Please enter a valid location.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createComplaint(form);
      navigate("/my-complaints");
    } catch {
      alert("Failed to submit complaint");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({
        ...f,
        photoData: reader.result,
        proofName: file.name,
      }));
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-16 px-6 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-xl border border-gray-100 p-10"
      >
        <h2 className="text-3xl font-semibold text-[#0A2540] mb-6">
          Raise a Civic Issue
        </h2>

        <input
          type="text"
          name="title"
          placeholder="Issue Title"
          required
          onChange={handleChange}
          className="w-full mb-4 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <textarea
          name="description"
          placeholder="Describe the issue..."
          required
          onChange={handleChange}
          className="w-full mb-4 px-4 py-3 rounded-xl h-28 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {/* LOCATION */}
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            name="locationText"
            placeholder="Enter address"
            value={form.locationText}
            onChange={handleChange}
            onBlur={handleLocationBlur}
            required
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            type="button"
            onClick={detectLocation}
            className="px-4 py-3 bg-blue-600 text-white rounded-xl"
          >
            {locating ? "Detecting..." : "Use Current"}
          </button>
        </div>

        <select
          name="category"
          onChange={handleChange}
          value={form.category}
          className="w-full mb-6 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="Roads">Roads</option>
          <option value="Lighting">Lighting</option>
          <option value="Sanitation">Sanitation</option>
          <option value="Water">Water</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="mb-6"
        />

        <button
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
        >
          {isSubmitting ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
};

export default RaiseIssue;
