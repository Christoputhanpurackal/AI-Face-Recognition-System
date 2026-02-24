import React, { useState } from "react";
import axios from "axios";

function AddFaceUpload() {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);

  const handleUpload = async () => {

    if (!name || !file) {
      alert("Enter name and select file");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", file);

    const res = await axios.post(
      "http://127.0.0.1:8000/add_face_upload/",
      formData
    );

    alert(res.data.message);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">

      <h2 className="text-xl font-semibold mb-4">
        Add Face (Upload)
      </h2>

      <input
        className="w-full mb-3 p-2 rounded bg-slate-700"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="file"
        className="mb-3"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={handleUpload}
        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
      >
        Upload Face
      </button>

    </div>
  );
}

export default AddFaceUpload;