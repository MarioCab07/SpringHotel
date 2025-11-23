import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAllRoomTypes } from "../../service/api.services";
import { toast } from "react-toastify";

const RoomTypeImageManager = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedTypeId, setSelectedTypeId] = useState(null);
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [altText, setAltText] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const baseApi = import.meta.env.VITE_BASE_URL + "/api";

  useEffect(() => {
    loadRoomTypes();
  }, []);

  useEffect(() => {
    if (selectedTypeId) loadImages(selectedTypeId);
    else setImages([]);
  }, [selectedTypeId]);

  const loadRoomTypes = async () => {
    setLoading(true);
    try {
      const res = await getAllRoomTypes();
      if (res && res.status === 200) {
        const list = res.data?.data ?? [];
        setRoomTypes(list);
        // preselect first if none selected
        if (!selectedTypeId && list.length > 0) {
          setSelectedTypeId(list[0].roomTypeId ?? list[0].id ?? null);
        }
      } else {
        setRoomTypes([]);
      }
    } catch (err) {
      console.error("Error loading room types", err);
      toast.error("Error cargando tipos de habitación");
      setRoomTypes([]);
    } finally {
      setLoading(false);
    }
  };

  const loadImages = async (typeId) => {
    setLoading(true);
    try {
      const resp = await axios.get(`${baseApi}/room_type/${typeId}/images`);
      const data = resp?.data?.data ?? [];
      setImages(data);
    } catch (err) {
      console.error("Error loading images", err);
      toast.error("Error cargando imágenes");
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (e) => {
    const val = e.target.value;
    setSelectedTypeId(val ? Number(val) : null);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedTypeId) return toast.warn("Seleccione un tipo de habitación primero");
    if (!file) return toast.warn("Seleccione un archivo");

    const form = new FormData();
    form.append("file", file);
    if (altText) form.append("alt", altText);

    try {
      setUploading(true);
      const token = sessionStorage.getItem("token");
      const headers = {
        "Content-Type": "multipart/form-data",
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      const resp = await axios.post(
        `${baseApi}/room_type/${selectedTypeId}/images`,
        form,
        { headers }
      );

      toast.success("Imagen subida");
      setFile(null);
      setAltText("");
      document.getElementById("roomtype-image-file")?.value && (document.getElementById("roomtype-image-file").value = "");
      await loadImages(selectedTypeId);
    } catch (err) {
      console.error("Upload error", err);
      const msg = err?.response?.data?.message || "Error subiendo imagen";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (!selectedTypeId) return;
    if (!confirm("¿Eliminar esta imagen?")) return;
    try {
      const token = sessionStorage.getItem("token");
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      await axios.delete(`${baseApi}/room_type/${selectedTypeId}/images/${imageId}`, { headers });
      toast.success("Imagen eliminada");
      await loadImages(selectedTypeId);
    } catch (err) {
      console.error("Delete error", err);
      toast.error("No se pudo eliminar la imagen");
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
      <h3 className="text-xl font-semibold mb-4">Manage Room Type Images</h3>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Seleccionar tipo:</label>
        <select
          value={selectedTypeId ?? ""}
          onChange={handleTypeChange}
          className="w-full md:w-1/2 border rounded px-3 py-2"
        >
          <option value="">-- seleccionar tipo de habitación --</option>
          {roomTypes.map((t) => (
            <option key={t.roomTypeId ?? t.id} value={t.roomTypeId ?? t.id}>
              {t.roomTypeName ?? t.name}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleUpload} className="flex flex-col md:flex-row items-start gap-3 mb-6">
        <input
          id="roomtype-image-file"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border rounded px-2 py-1"
        />
        <input
          type="text"
          placeholder="Alt text (opcional)"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-[#d4bf92] hover:bg-[#c6ae7b] disabled:opacity-60"
          disabled={uploading}
        >
          {uploading ? "Subiendo..." : "Subir imagen"}
        </button>
      </form>

      <div className="mt-2">
        <p className="text-sm text-gray-500 mb-2">
          {selectedTypeId ? `${images.length} imagen(es) para este tipo` : "No se ha seleccionado tipo"}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.length === 0 && (
            <div className="text-gray-500 col-span-3">No images for this type</div>
          )}

          {images.map((img) => (
            <div key={img.id} className="border rounded p-2 relative bg-white">
              <img src={img.url} alt={img.altText ?? "img"} className="w-full h-40 object-cover rounded" />
              <div className="mt-2 flex justify-between items-center">
                <small className="text-xs text-gray-600 truncate">{img.altText ?? "No alt"}</small>
                <div className="flex gap-2">
                  <button
                    className="text-red-600 text-xs"
                    onClick={() => handleDelete(img.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomTypeImageManager;
