import { useState } from "react";
import axios from "axios";
import FileInput from "./FileInput";
import ImageGrid from "./ImageGrid";

interface ImageData {
  id: string;
  url: string;
  labels?: string[];
  status: "pending" | "processed";
}

const ImageUpload = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Handle file selection & auto-upload
  const handleFileUpload = async (files: FileList | null) => {
    const uploadedImages: ImageData[] = [];
    setUploading(true);

    if (!files) {
      console.log("No files to upload");
      return;
    }

    const fileArray = Array.from(files);

    for (const file of fileArray) {
      const formData = new FormData();
      formData.append("images", file);

      try {
        const response = await axios.post(
          "http://localhost:3001/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        console.log(response.data.images);

        uploadedImages.push({
          id: response.data.images[0].imageId,
          url: URL.createObjectURL(file), // Local preview
          status: "pending",
        });
        console.log(uploadedImages);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }

    setUploading(false);
    setImages((prevImages) => [...prevImages, ...uploadedImages]);
  };

  // Process all unprocessed images
  const handleProcessAll = async () => {
    const unprocessedImages = images.filter(
      (image) => image.status === "pending"
    );
    if (unprocessedImages.length === 0) return alert("No unprocessed images");

    setProcessing(true);

    await Promise.all(
      unprocessedImages.map(async (image) => {
        handleProcessImage(image.id);
      })
    );

    setProcessing(false);
  };

  // Process a single image
  const handleProcessImage = async (imageId: string) => {
    try {
      const res = await axios.post(`http://localhost:3001/process`, {
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

  const handleImageClick = (image: ImageData) => {
    console.log("Clicked image:", image);
  };

  return (
    <div>
      <FileInput onChange={handleFileUpload} disabled={uploading} />
      <ImageGrid
        images={images}
        onProcessImage={handleProcessImage}
        onImageClick={handleImageClick}
      />
      <button
        onClick={handleProcessAll}
        disabled={
          processing || images.every((img) => img.status === "processed")
        }
      >
        {processing ? "Processing..." : "Process All"}
      </button>
    </div>
  );
};

export default ImageUpload;
