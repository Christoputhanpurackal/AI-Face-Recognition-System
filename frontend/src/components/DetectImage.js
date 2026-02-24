import React, { useState } from "react";
import axios from "axios";

function DetectImage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");

  const handleDetect = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/detect/",
        formData
      );
      setResult(response.data.result);
    } catch {
      alert("Detection failed");
    }
  };

  return (
    <div>
      <h2>Detect Image</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleDetect}>Detect</button>
      <h3>Result: {result}</h3>
    </div>
  );
}

export default DetectImage;