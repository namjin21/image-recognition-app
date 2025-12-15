import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function uploadToS3(uploadUrl: string, file: File) {
    await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });
}

export async function getPresignedUrl(fileName: string, fileType: string, idToken: string) {
    const res = await axios.post(
      `${API_BASE_URL}/api/images/presigned`,
      { fileName, fileType },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data; 
    // { uploadUrl, imageId, originalS3Key, optimizedS3Key }
  }

  export async function finalizeUpload(
      payload: {
        imageId: string;
        originalS3Key: string;
        originalFileName: string;
      },
      idToken: string
    ): Promise<void> {
      await axios.post(
        `${API_BASE_URL}/api/images/finalize`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  }