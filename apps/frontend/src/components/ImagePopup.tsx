import { ImageData } from "./ImageUpload";

interface ImagePopupProps {
  image: ImageData | null;
  onClose: () => void;
}

const ImagePopup: React.FC<ImagePopupProps> = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div className="fixed inset-0 bg-black/85 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg shadow-lg w-[400px]">
        <button
          className="absolute top-2 right-2 text-gray-500 px-2 py-1 rounded-sm cursor-pointer hover:bg-red-500"
          onClick={onClose}
        >
          ✖
        </button>
        <div className="text-lg font-semibold text-gray-700 pb-2 border-b border-gray-300">{image.originalFileName}</div>
        <img
          src={image.url}
          alt="Full View"
          className="w-full h-auto rounded-lg my-4"
        />
        <div>
          {image.labels?.length ? (
            image.labels.map((label, index) => (
              <span className="bg-blue-500 text-white text-xs font-semibold mx-0.5 my-0.5 px-2 py-1 rounded inline-block whitespace-nowrap" key={index}>{label}</span>
            ))
          ) : (
            <p className="text-black">No labels available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePopup;
