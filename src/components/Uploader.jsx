import React, { useState } from "react";
import axios from "axios";

import { BiUpload } from "react-icons/bi";

const getUploadURL = async (accessToken, path, overwrite = false) => {
  try {
    const url = `https://cloud-api.yandex.net/v1/disk/resources/upload?path=${encodeURIComponent(
      path
    )}&overwrite=${overwrite}`;
    const headers = { Authorization: `OAuth ${accessToken}` };

    const response = await axios.get(url, { headers });

    if (response.status === 200) {
      return response.data.href;
    } else {
      throw new Error("Failed to get upload URL");
    }
  } catch (error) {
    throw new Error("Error while fetching upload URL");
  }
};

const uploadFile = async (url, file) => {
  try {
    const headers = { "Content-Type": "application/octet-stream" };
    const response = await axios.put(url, file, { headers });

    if (response.status === 201) {
      return true;
    } else {
      throw new Error("Failed to upload file");
    }
  } catch (error) {
    throw new Error("Error while uploading file");
  }
};

const Uploader = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    try {
      const accessToken =
        "y0_AgAAAABrxbZCAADLWwAAAADozW7MThPhXnfBSb6KNm4sohg4jf6Gb-0";
      const uploadPath = "test";

      if (selectedFiles.length < 1 || selectedFiles.length > 100) {
        alert("Выберите от 1 до 100 файлов для загрузки");
        return;
      }

      setIsLoading(true);

      for (const file of selectedFiles) {
        const uploadURL = await getUploadURL(
          accessToken,
          `${uploadPath}/${file.name}`
        );
        await uploadFile(uploadURL, file);
      }

      setIsUploaded(true);
      setIsLoading(false);

      setSelectedFiles([]);
    } catch (error) {
      setIsLoading(false);
      setIsUploaded(false);
      alert("Произошла ошибка при загрузке файлов на Яндекс.Диск.");
      setSelectedFiles([]);
    }
  };

  return (
    <div className="file-uploader-container">
      <div class="input__wrapper">
        <input
          name="file"
          type="file"
          id="input__file"
          class="input input__file"
          multiple
          onChange={handleChange}
        />
        <label for="input__file" class="input__file-button">
          <span class="input__file-icon-wrapper">
            <BiUpload />
          </span>
          <span class="input__file-button-text">Выберите файлы</span>
        </label>
      </div>
      <div className="files_len"> Выбранно файлов : {selectedFiles.length}</div>
      <button className="upload-button" onClick={handleUpload}>
        Загрузить
      </button>

      {isLoading && <div className="loading-message">Загрузка...</div>}
      {isUploaded && (
        <div className="success-message">
          Файлы успешно загружены на Яндекс.Диск!
        </div>
      )}
    </div>
  );
};

export default Uploader;
