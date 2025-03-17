interface FileInputProps {
    onChange: (files: FileList | null) => Promise<void>;
    disabled?: boolean;
}

const FileInput: React.FC<FileInputProps> = ({onChange, disabled}) => {
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.files);
      };

    return (
    <div className="my-2">
      <input
        type="file"
        multiple
        onChange={handleInputChange}
        disabled={disabled}
        id="file_input"
        className="w-full text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded"
      />
    </div>
  );
};

export default FileInput;
