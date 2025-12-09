import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

import axios from "axios";
import { debounce } from "lodash";

import FunctionBar from "./FunctionBar";
import ImageGrid from "./ImageGrid";
import ImagePopup from "./ImagePopup";

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
  const [uploading, setUploading] = useState(false);
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

  // Handle file selection & auto-upload
  const handleFileUpload = async (files: FileList | null) => {
    if (!files) {
      console.log("No files to upload");
      return;
    }
    const start = performance.now();

    setUploading(true);
    const fileArray = Array.from(files);
    let tempUrl = "";

    // 임시 썸네일 우선 추가
    const tempImages: ImageData[] = fileArray.map((file) => {
      const tempId = crypto.randomUUID();
      tempUrl = URL.createObjectURL(file);
      return {
        id: tempId,
        originalFileName: file.name,
        url: tempUrl, // 브라우저에서 즉시 렌더
        status: "uploading" as const,
      };
    });
    setImages((prev) => [...prev, ...tempImages]);

    // 업로드 함수
    const uploadSingleFile = async (file: File, tempId: string) => {
      try {
        const formData = new FormData();
        formData.append("images", file);

        const response = await axios.post(`${API_BASE_URL}/api/images/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${idToken}`,
          },
        });

        const uploaded = response.data.images[0]; // [ { imageId, presignedUrl } ]
        console.log(uploaded);
        // 3) 업로드 성공 → URL 업데이트 (이미지 안 깨짐)
        setImages((prev) =>
          prev.map((img) =>
            img.id === tempId
              ? {
                  ...img,
                  id: uploaded.imageId,
                  status: "pending",
                }
              : img
          )
        );

        // await handleProcessImage(uploaded.imageId);
        

        // 처리 완료
        // setImages((prev) =>
        //   prev.map((img) => (img.id === uploaded.imageId ? { ...img, status: "processed" } : img))
        // );
      } catch (err) {
        console.error("Upload failed:", err);
        setImages((prev) =>
          prev.map((img) => (img.id === tempId ? { ...img, status: "failed" } : img))
        );
      }
    };

    // 병렬 업로드 제한
    for (let i = 0; i < fileArray.length; i += MAX_PARALLEL_UPLOADS) {
      const chunk = fileArray.slice(i, i + MAX_PARALLEL_UPLOADS);
      await Promise.all(
        chunk.map((file, idx) =>
          uploadSingleFile(file, tempImages[i + idx].id)
        )
      );
    }

    // const formData = new FormData();
    // fileArray.forEach((file) => formData.append("images", file));
    // const response = await axios.post(`${API_BASE_URL}/api/images/upload`, formData, {
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //     Authorization: `Bearer ${idToken}`,
    //   },
    // });

    // const uploadedImages: ImageData[] = response.data.images.map(
    //   (image: any) => ({
    //     id: image.imageId,
    //     originalFileName: image.originalFileName,
    //     status: "pending",
    //   })
    // );

    // setImages((prevImages) => [...prevImages, ...uploadedImages]);
    const end = performance.now();
    console.log("여러 api call upload duration:", end - start, "ms");

    setUploading(false);
  };

  // Process all newly uploaded images
  const handleProcessAll = async (uploadedImages: ImageData[]) => {
    try {
      await Promise.all(
        uploadedImages.map(async (image) => {
          await handleProcessImage(image.id);
        })
      );
    } catch (error) {
      console.log("Processing all images failed", error)
    }
  };

  // Process a single image
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

      // return {
      //   labels: res.data.labels,
      //   category: res.data.category,
      //   story: res.data.story,
      //   optimizedPresignedUrl: res.data.optimizedPresignedUrl ?? null,
      // };
      
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

  return (
    <div className="m-4">
      <FunctionBar
            images={filteredImages}
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
