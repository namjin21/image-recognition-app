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
          <div
            className="relative group"
            onClick={() => {
              if (!selectionMode) onImageClick(image);
            }}
          >
            <img
              className={`w-full h-auto object-cover rounded-xl shadow hover:bg-linear-270 from-white to-zinc-900 ${
                image.status === "pending" ? "opacity-50" : "cursor-pointer"
              } ${
                selectionMode &&
                selectedImageIds.includes(image.id) &&
                "border-3 border-sky-500"
              }`}
              src={image.url}
              alt="preview"
              width={200}
              height={200}
            />
            {image.status === "processed" && (
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300 rounded-xl hover:cursor-pointer" />
            )}
          </div>
          {selectionMode && (
            <input
              type="checkbox"
              checked={selectedImageIds.includes(image.id)}
              onChange={() => toggleImageSelection(image.id)}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-2 left-2 w-5 h-5"
            />
          )}
          {/* {(image.status === "pending" || image.status === "processing") && ( */}
            <button
              className="absolute inset-0 m-auto w-35 h-20 bg-transparent text-white font-bold rounded-full shadow-lg flex items-center justify-center cursor-pointer"
              onClick={() => onProcessImage(image.id)}
            >
              {image.status !== "processing" ? "추억 생성 중..." : "추억 생성하기"}
            </button>
          {/* )} */}
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
