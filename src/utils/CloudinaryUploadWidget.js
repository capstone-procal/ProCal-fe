import React, { useEffect, useRef } from "react";
import { Button } from "react-bootstrap";

const CLOUDNAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOADPRESET = process.env.REACT_APP_CLOUDINARY_PRESET;

const CloudinaryUploadWidget = ({ uploadImage }) => {
  const widgetRef = useRef(null);

  useEffect(() => {
    if (!window.cloudinary) {
      console.error("Cloudinary 스크립트가 로드되지 않았습니다.");
      return;
    }

    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDNAME,
        uploadPreset: UPLOADPRESET,
        sources: ["local", "url", "camera"],
        multiple: false,
        maxFiles: 1,
        folder: "market",
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("업로드 성공:", result.info.secure_url);
          uploadImage(result.info.secure_url);
        }
      }
    );
  }, [uploadImage]);

  const handleClick = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    }
  };

  return (
    <Button onClick={handleClick} size="sm" variant="outline-primary">
      + 이미지 업로드
    </Button>
  );
};

export default CloudinaryUploadWidget;