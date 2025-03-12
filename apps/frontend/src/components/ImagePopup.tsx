interface ImagePopupProps {
    image: {
      id: string;
      url: string;
      labels?: string[];
    } | null;
    onClose: () => void;
  }
  
  const ImagePopup: React.FC<ImagePopupProps> = ({ image, onClose }) => {
    if (!image) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-4 rounded-lg shadow-lg w-[400px]">
          <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>✖</button>
          <img src={image.url} alt="Full View" className="w-full h-auto rounded-lg mb-4" />
          <h3 className="text-lg font-bold">Labels:</h3>
          <ul>
            {image.labels?.length ? (
              image.labels.map((label, index) => <li key={index}>- {label}</li>)
            ) : (
              <p>No labels available</p>
            )}
          </ul>
        </div>
      </div>
    );
  };
  
  export default ImagePopup;