import { useCallback, useState } from "react";
import { getPresignedUrl, uploadToS3, finalizeUpload } from "../utils/imageUploadUtils";
import { ImageData } from "../components/ImageUpload";

interface UseImageUploadParams {
    idToken: string | null;
    setImages: React.Dispatch<React.SetStateAction<ImageData[]>>;
    onAfterUpload?: (imageId: string) => Promise<void> | void; // 이후 handleProcessImage 처리
}

export function useImageUpload({ idToken, setImages, onAfterUpload }: UseImageUploadParams) {
    const [uploading, setUploading] = useState(false);
  
    const handleFileUpload = useCallback(
      async (files: FileList | null) => {
        if (!files || files.length === 0) {
          console.log("No files to upload");
          return;
        }
        if (!idToken) {
          console.warn("No idToken, cannot upload");
          return;
        }
        const start = performance.now();
  
        setUploading(true);
        const fileArray = Array.from(files);
  
        // 임시 썸네일 보여주기기
        const tempImages: ImageData[] = fileArray.map((file) => {
          const tempId = crypto.randomUUID();
          return {
            id: tempId, // 프론트 렌더링용 고정 ID
            originalFileName: file.name,
            url: URL.createObjectURL(file),
            status: "uploading" as const,
          };
        });
  
        setImages((prev) => [...prev, ...tempImages]);
  
        try {
          // 2) 파일별 업로드 (병렬)
          await Promise.all(
            fileArray.map(async (file, index) => {
              const tempId = tempImages[index].id;
  
              try {
                // presigned 업로드 URL 발급
                const { uploadUrl, imageId, originalS3Key } = await getPresignedUrl(
                  file.name,
                  file.type,
                  idToken
                );
  
                // S3로 direct upload
                await uploadToS3(uploadUrl, file);
  
                // metadata 저장 + optimizedKey/presignedUrl 반환
                await finalizeUpload(
                  {
                    imageId,
                    originalS3Key,
                    originalFileName: file.name,
                  },
                  idToken
                );
  
                setImages((prev) =>
                  prev.map((img) =>
                    img.id === tempId
                      ? {
                          ...img,
                          id: imageId,
                          status: "pending",
                        }
                      : img
                  )
                );
  
                // 업로드 후 바로 process API 호출
                // TODO: api 연결
                if (onAfterUpload) {
                  await onAfterUpload(imageId);
                }
              } catch (err) {
                console.error("Single file upload failed:", err);
                setImages((prev) =>
                  prev.map((img) =>
                    img.id === tempId ? { ...img, status: "failed" } : img
                  )
                );
              }
            })
          );
        } finally {
          setUploading(false);
          
          const end = performance.now();
          console.log("프론트 presigned url 업로드 방식 - 사진 50장 (700MB) 업로드 시간:", end - start, "ms");

        }
      },
      [idToken, setImages, onAfterUpload]
    );
  
    return { handleFileUpload, uploading };
  }