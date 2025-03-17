interface ImageData {
  id: string;
  url: string;
  status: "pending" | "processed";
}

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
    <div className="columns-3 gap-4">
      {images.map((image) => (
        <div
          key={image.id}
          className="relative mb-4 break-inside-avoid"
        >
          <img className="w-full h-auto object-cover rounded-md shadow" src={image.url} alt="preview" width={200} height={200} onClick={() => onImageClick(image)} />
          <button
            onClick={() => onProcessImage(image.id)}
            disabled={image.status === "processed"}
          >
            {image.status === "processed" ? "✅ Processed" : "Process"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
