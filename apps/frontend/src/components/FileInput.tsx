interface FileInputProps {
    onChange: (files: FileList | null) => Promise<void>;
    disabled?: boolean;
}

const FileInput: React.FC<FileInputProps> = ({onChange, disabled}) => {
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.files);
      };

    return (
    <div>
      <input
        type="file"
        multiple
        onChange={handleInputChange}
        disabled={disabled}
      />
    </div>
  );
};

export default FileInput;
