import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createComplaint } from "../utils/api";

const RaiseIssue = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    locationText: "",
    category: "Roads",
    town: "",
    coords: undefined,
    proofName: "",
    photoData: "",
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      // prepare payload - include coords and proofName/photoData if available
      const payload = {
        title: form.title,
        description: form.description,
        locationText: form.locationText,
        town: form.town,
        category: form.category,
      };

      if (form.coords) payload.coords = form.coords;
      if (form.proofName) payload.proofName = form.proofName;
      if (form.photoData) payload.photoData = form.photoData; // backend may ignore but useful for offline/testing

      await createComplaint(payload);
      navigate("/my-complaints");
    } catch (error) {
      console.error(error);
      alert("Failed to submit complaint");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result;
      setForm((f) => ({ ...f, photoData: data, proofName: file.name }));
      setPhotoPreview(data);
    };
    reader.readAsDataURL(file);
  };

  const clearPhoto = () => {
    setForm((f) => ({ ...f, photoData: "", proofName: "" }));
    setPhotoPreview(null);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude);
        const lng = Number(pos.coords.longitude);
        const short = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        // Reverse geocode with OpenStreetMap Nominatim to get a readable address
        (async () => {
          try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
              lat
            )}&lon=${encodeURIComponent(lng)}&addressdetails=1`;
            const res = await fetch(url, { headers: { Accept: "application/json" } });
            if (res.ok) {
              const js = await res.json();
              const display = js.display_name || short;
              // try to extract town/locality
              const addr = js.address || {};
              const town = addr.town || addr.city || addr.village || addr.county || "";
              setForm((f) => ({ ...f, locationText: display, coords: [lat, lng], town: town || f.town }));
              return;
            }
          } catch (e) {
            console.warn("Reverse geocode failed", e);
          }
          // fallback to coords-only text
          setForm((f) => ({ ...f, locationText: short, coords: [lat, lng] }));
        })();
      },
      (err) => {
        console.error("Geolocation error", err);
        alert("Unable to fetch location: " + (err.message || "unknown"));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
  <div className="min-h-screen flex justify-center items-center 
  bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] 
  px-6 relative overflow-hidden">

    <div className="absolute w-[400px] h-[400px] bg-[#2EC4B6]/20 rounded-full blur-3xl top-[-120px] left-[-120px]" />
    <div className="absolute w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-3xl bottom-[-120px] right-[-120px]" />

    <form 
      onSubmit={handleSubmit} 
      className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 
      p-8 md:p-10 rounded-3xl shadow-2xl max-w-xl w-full text-white"
    >
      <h2 className="text-3xl font-bold mb-2">Raise a Civic Issue 🚧</h2>
      <p className="text-gray-300 text-sm mb-8">
        Help improve your community by reporting issues
      </p>

      <input
        type="text"
        name="title"
        placeholder="Issue Title"
        required
        onChange={handleChange}
        className="w-full mb-4 p-4 rounded-xl bg-white/10 border border-white/20 
        placeholder-gray-400 focus:ring-2 focus:ring-[#2EC4B6] outline-none transition"
      />

      <textarea
        name="description"
        placeholder="Describe the issue in detail..."
        required
        onChange={handleChange}
        className="w-full mb-4 p-4 rounded-xl h-32 bg-white/10 border border-white/20 
        placeholder-gray-400 focus:ring-2 focus:ring-[#2EC4B6] outline-none transition"
      />

      {/* LOCATION */}
      <div className="flex gap-3 items-center mb-4">
        <input
          type="text"
          name="locationText"
          placeholder="Location (address or coordinates)"
          required
          value={form.locationText}
          onChange={handleChange}
          className="flex-1 p-4 rounded-xl bg-white/10 border border-white/20 
          placeholder-gray-400 focus:ring-2 focus:ring-[#2EC4B6] outline-none"
        />
        <div className="flex flex-col items-end">
          <button 
            type="button" 
            onClick={useCurrentLocation} 
            className="px-4 py-2 bg-[#2EC4B6] text-[#0A2540] font-medium rounded-xl 
            hover:scale-105 active:scale-95 transition"
          >
            Use Current
          </button>

          {form.coords && (
            <a
              href={`https://www.openstreetmap.org/?mlat=${form.coords[0]}&mlon=${form.coords[1]}#map=18/${form.coords[0]}/${form.coords[1]}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-gray-400 mt-1 hover:text-white transition"
            >
              View on map
            </a>
          )}
        </div>
      </div>

      {/* SELECTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <select 
          name="category" 
          onChange={handleChange} 
          value={form.category} 
          className="p-4 rounded-xl bg-white/10 border border-white/20 
          focus:ring-2 focus:ring-[#2EC4B6] outline-none"
        >
          <option value="Roads">Roads</option>
          <option value="Lighting">Lighting</option>
          <option value="Sanitation">Sanitation</option>
          <option value="Water">Water</option>
          <option value="Other">Other</option>
        </select>

        <select 
          name="town" 
          required 
          onChange={handleChange} 
          value={form.town} 
          className="p-4 rounded-xl bg-white/10 border border-white/20 
          focus:ring-2 focus:ring-[#2EC4B6] outline-none"
        >
          <option value="">Select Town</option>
          <option value="Downtown">Downtown</option>
          <option value="Uptown">Uptown</option>
          <option value="Midtown">Midtown</option>
        </select>
      </div>

      {/* PHOTO UPLOAD */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Upload Photo (optional)
        </label>

        <div
          className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 
          border border-dashed border-white/30 hover:border-[#2EC4B6] 
          transition"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer?.files?.[0];
            if (f) handleFile(f);
          }}
        >
          <input
            id="photo-input"
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="hidden"
          />

          <label 
            htmlFor="photo-input" 
            className="px-4 py-2 bg-[#2EC4B6] text-[#0A2540] 
            rounded-xl cursor-pointer font-medium hover:scale-105 transition"
          >
            Choose Photo
          </label>

          <div className="flex-1 min-w-0">
            <div className="text-sm text-gray-300 truncate">
              {form.proofName || "No file chosen"}
            </div>
            <div className="text-xs text-gray-400">
              Drag & drop supported
            </div>
          </div>

          {photoPreview && (
            <div className="relative">
              <img 
                src={photoPreview} 
                alt="preview" 
                className="w-24 h-24 rounded-xl object-cover border border-white/20"
              />
              <button 
                type="button" 
                onClick={clearPhoto} 
                className="absolute -top-2 -right-2 bg-white text-black 
                rounded-full w-6 h-6 text-xs shadow hover:scale-110 transition"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <button 
        disabled={isSubmitting} 
        className="w-full bg-[#2EC4B6] text-[#0A2540] py-4 rounded-xl 
        text-lg font-semibold shadow-lg hover:scale-[1.02] 
        active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit Complaint"}
      </button>
    </form>
  </div>
);}

export default RaiseIssue;
