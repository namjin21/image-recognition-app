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
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, 200px)",
        gap: "10px",
        marginTop: "10px",
      }}
    >
      {images.map((image) => (
        <div
          key={image.id}
          style={{
            position: "relative",
            border:
              image.status === "processed"
                ? "2px solid green"
                : "2px solid red",
          }}
        >
          <img src={image.url} alt="preview" width={200} height={200} />
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
