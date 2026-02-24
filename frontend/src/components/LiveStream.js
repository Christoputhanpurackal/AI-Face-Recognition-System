import React, { useState } from "react";
import axios from "axios";

function LiveStream() {
  const [running, setRunning] = useState(false);

  const startCamera = async () => {
    await axios.post("http://127.0.0.1:8000/start_camera/");
    setRunning(true);
  };

  const stopCamera = async () => {
    await axios.post("http://127.0.0.1:8000/stop_camera/");
    setRunning(false);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">

      <h2 className="text-xl font-semibold mb-4">
        Live Recognition
      </h2>

      <div className="mb-4">
        {!running ? (
          <button
            onClick={startCamera}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
          >
            Start Camera
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
          >
            Stop Camera
          </button>
        )}
      </div>

      {running && (
        <img
          src="http://127.0.0.1:8000/video_feed"
          alt="Live"
          className="rounded-xl border border-slate-600"
        />
      )}

    </div>
  );
}

export default LiveStream;