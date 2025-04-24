import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

import axios from "axios";
import { debounce } from "lodash";

import FunctionBar from "./FunctionBar";
import ImageGrid from "./ImageGrid";
import ImagePopup from "./ImagePopup";

export interface ImageData {
  id: string;
  url: string;
  originalFileName: string;
  labels?: string[];
  status: "pending" | "processed";
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ImageUpload = () => {
  const { userId, loading, idToken } = useUser();
  const [images, setImages] = useState<ImageData[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [searchWord, setSearchWord] = useState("");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);

  useEffect(() => {
    console.log(userId);
    const fetchImages = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/metadata/all/${userId}`);
        console.log(res.data);
        setImages((prevImages) => [...prevImages, ...res.data]);
      } catch (error) {
        console.log("Error fetching images:", error);
      }
    };

    if (!loading && userId) {
      fetchImages();
    }
  }, [loading, userId]);

  // Handle file selection & auto-upload
  const handleFileUpload = async (files: FileList | null) => {
    if (!files) {
      console.log("No files to upload");
      return;
    }

    setUploading(true);
    const fileArray = Array.from(files);

    try {
      const formData = new FormData();
      fileArray.forEach((file) => formData.append("images", file));

      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${idToken}`,
        },
      });

      const uploadedImages: ImageData[] = response.data.images.map(
        (image: any) => ({
          id: image.imageId,
          originalFileName: image.originalFileName,
          url: image.presignedUrl,
          status: "pending",
        })
      );
      console.log(uploadedImages);

      setImages((prevImages) => [...prevImages, ...uploadedImages]);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  // Process all unprocessed images
  const handleProcessAll = async () => {
    const unprocessedImages = images.filter(
      (image) => image.status === "pending"
    );
    if (unprocessedImages.length === 0) return alert("No unprocessed images");

    setIsProcessing(true);

    try {
      await Promise.all(
        unprocessedImages.map(async (image) => {
          await handleProcessImage(image.id);
        })
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Process a single image
  const handleProcessImage = async (imageId: string) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/process`, {
        userId,
        imageId,
      });
      console.log(res.data.labels);
      setImages((prevImages) =>
        prevImages.map((img) =>
          img.id === imageId
            ? { ...img, status: "processed", labels: res.data.labels }
            : img
        )
      );
    } catch (error) {
      console.error("Processing failed:", error);
    }
  };

  // Open popup with selected image
  const handleImageClick = (image: ImageData) => {
    if (image.status === "processed") {
      setSelectedImage(image);
    }
  };

  // Close popup
  const handleClosePopup = () => {
    setSelectedImage(null);
  };

  // Debounced search function to optimize performance
  const handleSearch = debounce((event: any) => {
    setSearchWord(event.target.value.toLowerCase());
  }, 300); // 300ms debounce time

  // Filter images based on search word
  const filteredImages = images.filter(
    (img) =>
      !searchWord ||
      img.labels?.some((label) => label.toLowerCase().includes(searchWord))
  );

  const handleDeleteSelected = async () => {
    if (!userId || selectedImageIds.length === 0) return;

    try {
      await axios.delete(`${API_BASE_URL}/images/${userId}`, {
        data: { imageIds: selectedImageIds },
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      // Remove deleted images from state
      setImages((prev) =>
        prev.filter((img) => !selectedImageIds.includes(img.id))
      );
      setSelectionMode(false);
      setSelectedImageIds([]);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };
  
  const toggleImageSelection = (id: string) => {
    setSelectedImageIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const clearSelection = () => {
    setSelectedImageIds([]);
    setSelectionMode(false);
  };

  return (
    <div className="m-4">
      <FunctionBar
            images={filteredImages}
            handleProcessAll={handleProcessAll}
            isProcessing={isProcessing}
            selectionMode={selectionMode}
            setSelectionMode={setSelectionMode}
            handleDeleteSelected={handleDeleteSelected}
            selectedImageIds={selectedImageIds}
            clearSelection={clearSelection}
            handleSearch={handleSearch}
      />

      <ImageGrid
        images={filteredImages}
        onProcessImage={handleProcessImage}
        onImageClick={handleImageClick}
        handleFileUpload={handleFileUpload}
        uploading={uploading}
        selectionMode={selectionMode}
        selectedImageIds={selectedImageIds}
        toggleImageSelection={toggleImageSelection}
      />

      {/* Image Popup */}
      {selectedImage && (
        <ImagePopup image={selectedImage} onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default ImageUpload;
