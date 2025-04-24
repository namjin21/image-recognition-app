import { ImageData } from "./ImageUpload";
import { MdClose } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";

interface FunctionBarProps {
  images: ImageData[];
  handleProcessAll: () => void;
  isProcessing: boolean;
  selectionMode: boolean;
  setSelectionMode: (value: boolean) => void;
  handleDeleteSelected: () => void;
  selectedImageIds: string[];
  clearSelection: () => void;
  handleSearch: (event: any) => void;
}

const FunctionBar: React.FC<FunctionBarProps> = ({
  images,
  handleProcessAll,
  isProcessing,
  selectionMode,
  setSelectionMode,
  handleDeleteSelected,
  selectedImageIds,
  clearSelection,
  handleSearch,
}) => {
  if (selectionMode) {
    return (
      <div className="flex justify-between items-center bg-gray-100 p-3 -mt-3 -mx-3 mb-4 shadow">
        <button
          className="text-black px-1.5 py-1.5 rounded-full cursor-pointer hover:bg-gray-200"
          onClick={clearSelection}
        >
          <MdClose />
        </button>
        <span className="text-black">{selectedImageIds.length} selected</span>
        <button
          onClick={handleDeleteSelected}
          disabled={selectedImageIds.length === 0}
          className="text-gray-600 px-2 py-2 rounded-full cursor-pointer hover:bg-gray-200 disabled:cursor-not-allowed"
        >
          <FaRegTrashCan />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 w-full">
      <button
        className={`whitespace-nowrap min-w-max px-4 py-2 rounded ${
          images.every((img) => img.status === "processed")
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-cyan-600 text-white hover:bg-cyan-700"
        }`}
        onClick={handleProcessAll}
        disabled={
          isProcessing || images.every((img) => img.status === "processed")
        }
      >
        {isProcessing ? "Processing..." : "Process All"}
      </button>

      <button
        className={`whitespace-nowrap min-w-max px-4 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-700 cursor-pointer`}
        onClick={() => setSelectionMode(true)}
      >
        Select Images
      </button>

      <input
        type="text"
        placeholder="Search for an image tag..."
        onChange={handleSearch}
        className="w-full sm:grow px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
};

export default FunctionBar;
