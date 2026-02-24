import React from "react";
import LiveStream from "./components/LiveStream";
import AddFaceUpload from "./components/AddFaceUpload";
import AddFaceLive from "./components/AddFaceLive";
import UserManager from "./components/UserManager";

function App() {
  return (
    <div className="min-h-screen text-white p-6">
      
      <h1 className="text-4xl font-bold text-center mb-8">
        AI Face Recognition Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-6">

        <LiveStream />
        <AddFaceUpload />
        <AddFaceLive />
        <UserManager />

      </div>

    </div>
  );
}

export default App;