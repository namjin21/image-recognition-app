interface FileInputProps {
  onChange: (files: FileList | null) => Promise<void>;
  disabled?: boolean;
}

const FileInput: React.FC<FileInputProps> = ({ onChange, disabled }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.files);
  };

  return (
    // <div className="my-2">
    //   <input
    //     type="file"
    //     multiple
    //     onChange={handleInputChange}
    //     disabled={disabled}
    //     id="file_input"
    //     className="w-full text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded"
    //   />
    // </div>

    <label
      className={`flex flex-col items-center justify-center border border-dashed border-gray-400 rounded-lg p-4 aspect-square mb-4 ${
        disabled ? "cursor-default": "cursor-pointer"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-10 h-10 text-gray-500"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M12 2a1 1 0 011 1v8h8a1 1 0 110 2h-8v8a1 1 0 11-2 0v-8H3a1 1 0 110-2h8V3a1 1 0 011-1z"
          clipRule="evenodd"
        />
      </svg>
      <span className="text-gray-500 text-sm mt-2">Add Photo</span>
      <input
        type="file"
        multiple
        disabled={disabled}
        className="hidden"
        onChange={handleInputChange}
      />
    </label>
  );
};

export default FileInput;
