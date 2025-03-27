import { ImageData } from "./ImageUpload";

interface ImageGridProps {
  images: ImageData[];
  onProcessImage: (imageId: string) => void;
  onImageClick: (image: ImageData) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  onProcessImage,
  onImageClick,
}) => {
  return (
    <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-4 gap-4">
      {images.map((image) => (
        <div key={image.id} className="relative mb-4 break-inside-avoid">
          <img
            className={`w-full h-auto object-cover rounded-xl shadow ${image.status === "pending" ? "opacity-50" : "cursor-pointer" }`}
            src={image.url}
            alt="preview"
            width={200}
            height={200}
            onClick={() => onImageClick(image)}
          />
          {image.status === "pending" && (
            <button
              className="absolute inset-0 m-auto w-30 h-10 bg-teal-500 text-white font-bold rounded shadow-lg hover:bg-teal-600 flex items-center justify-center cursor-pointer"
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
