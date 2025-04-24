import FileInput from "./FileInput";
import { ImageData } from "./ImageUpload";

interface ImageGridProps {
  images: ImageData[];
  onProcessImage: (imageId: string) => void;
  onImageClick: (image: ImageData) => void;
  handleFileUpload: (files: FileList | null) => Promise<void>;
  uploading: boolean;
  selectionMode: boolean;
  selectedImageIds: string[];
  toggleImageSelection: (id: string) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  onProcessImage,
  onImageClick,
  handleFileUpload,
  uploading,
  selectionMode,
  selectedImageIds,
  toggleImageSelection,
}) => {
  return (
    <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4">
      {/* Upload Button (First Grid Item) */}
      <FileInput onChange={handleFileUpload} disabled={uploading} />

      {/* Uploaded Images */}
      {images.map((image) => (
        <div
          key={image.id}
          className="relative mb-4 break-inside-avoid"
          onClick={() => {
            if (selectionMode) toggleImageSelection(image.id);
          }}
        >
          <img
            className={`w-full h-auto object-cover rounded-xl shadow ${
              image.status === "pending" ? "opacity-50" : "cursor-pointer"
            } ${
              selectionMode && selectedImageIds.includes(image.id)
                ? "border-2 border-amber-400"
                : ""
            }`}
            src={image.url}
            alt="preview"
            width={200}
            height={200}
            onClick={() => {
              if (!selectionMode) onImageClick(image);
            }}
          />{" "}
          {selectionMode && (
            <input
              type="checkbox"
              checked={selectedImageIds.includes(image.id)}
              onChange={() => toggleImageSelection(image.id)}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-2 left-2 w-5 h-5"
            />
          )}
          {image.status === "pending" && (
            <button
              className="absolute inset-0 m-auto w-30 h-10 bg-cyan-500 text-white font-bold rounded shadow-lg hover:bg-cyan-600 flex items-center justify-center cursor-pointer"
              onClick={() => onProcessImage(image.id)}
            >
              Process
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
