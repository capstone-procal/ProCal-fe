import React, { useEffect } from "react";
import { Button } from "react-bootstrap";

const CLOUDNAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOADPRESET = process.env.REACT_APP_CLOUDINARY_PRESET;

const CloudinaryUploadWidget = ({ uploadImage }) => {
  useEffect(() => {
    if (!window.cloudinary) {
      console.error("Cloudinary 스크립트가 로드되지 않았습니다.");
      return;
    }

    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDNAME,
        uploadPreset: UPLOADPRESET,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("업로드 완료:", result.info.secure_url);
          uploadImage(result.info.secure_url);
          myWidget.close();
        }
      }
    );

    const uploadButton = document.getElementById("upload_widget");
    if (uploadButton) {
      uploadButton.addEventListener("click", () => myWidget.open(), false);
    }

    return () => {
      if (uploadButton) {
        uploadButton.removeEventListener("click", () => myWidget.open());
      }
    };
  }, [uploadImage]);

  return (
    <Button id="upload_widget" size="sm" className="ml-2">
      Upload Image +
    </Button>
  );
};

export default CloudinaryUploadWidget;