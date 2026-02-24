import React, { useState } from "react";
import axios from "axios";

function AddFaceLive() {
  const [name, setName] = useState("");

  const handleCapture = async () => {

    if (!name) {
      alert("Enter name");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);

    const res = await axios.post(
      "http://127.0.0.1:8000/add_face_live/",
      formData
    );

    alert(res.data.message);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">

      <h2 className="text-xl font-semibold mb-4">
        Add Face (Live Capture)
      </h2>

      <input
        className="w-full mb-3 p-2 rounded bg-slate-700"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        onClick={handleCapture}
        className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg"
      >
        Capture Now
      </button>

    </div>
  );
}

export default AddFaceLive;