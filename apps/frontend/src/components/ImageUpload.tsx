import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

import axios from "axios";
import { debounce } from "lodash";

import FunctionBar from "./FunctionBar";
import ImageGrid from "./ImageGrid";
import ImagePopup from "./ImagePopup";
import { useImageUpload } from "../hooks/useImageUpload";

export interface ImageData {
  id: string;       // 프론트 렌더링용 (불변값)
  imageId?: string; // 서버에서 할당되는 실제 imageId
  url: string;
  originalFileName?: string;
  labels?: string[];
  story?: string;
  category?: string;
  status?: "uploading" | "pending" | "processing" | "processed" | "deleting" | "failed";
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const MAX_PARALLEL_UPLOADS = 100;

const ImageUpload = () => {
  const { userId, loading, idToken } = useUser();
  const [images, setImages] = useState<ImageData[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [searchWord, setSearchWord] = useState("");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);

  useEffect(() => {
    console.log(userId);
    const fetchImages = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/images`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        console.log(res.data);
        setImages((prevImages) => [...prevImages, ...res.data]);
      } catch (error) {
        console.log("Error fetching images:", error);
      }
    };

    if (!loading && userId) {
      fetchImages();
    }
  }, [idToken, loading, userId]);

  const handleProcessImage = async (imageId: string) => {
    try {
      setImages((prevImages) =>
        prevImages.map((img) =>
          img.id === imageId
            ? { ...img,
                status: "processing",
              }
            : img
        )
      );

      const res = await axios.post(`${API_BASE_URL}/api/images/${imageId}/analyze`, 
        {}, // body is empty for now
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
      
      setImages((prevImages) =>
        prevImages.map((img) =>
          img.id === imageId
            ? { ...img,
                status: "processed",
                labels: res.data.labels,
                category: res.data.category,
                story: res.data.story,
                url: res.data.optimizedPresignedUrl ?? img.url,
              }
            : img
        )
      );
    } catch (error) {
      console.error("Processing failed:", error);
    }
  };

  const { handleFileUpload, uploading } = useImageUpload({
    idToken,
    setImages,
    onAfterUpload: handleProcessImage,
  });

  // Open popup with selected image
  const handleImageClick = (image: ImageData) => {
    if (image.status === "processed" || image.status === "pending") {
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
      await axios.delete(`${API_BASE_URL}/api/images`, {
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

  const toggleSelectAll = () => {
    if (!selectionMode) return;

    if (selectedImageIds.length === filteredImages.length) {
      setSelectedImageIds([]);
    } else {
      setSelectedImageIds(filteredImages.map((img) => img.id));
    }
  }

  return (
    <div className="m-4">
      <FunctionBar
            images={filteredImages}
            selectionMode={selectionMode}
            setSelectionMode={setSelectionMode}
            handleDeleteSelected={handleDeleteSelected}
            selectedImageIds={selectedImageIds}
            toggleSelectAll={toggleSelectAll}
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
