import React, { useEffect, useState } from "react";
import axios from "axios";

function UserManager() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await axios.get("http://127.0.0.1:8000/users/");
    setUsers(res.data.users);
  };

  const deleteUser = async (name) => {
    await axios.delete(`http://127.0.0.1:8000/delete_user/${name}`);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">

      <h2 className="text-xl font-semibold mb-4">
        Registered Users
      </h2>

      <ul>
        {users.map((user, index) => (
          <li
            key={index}
            className="flex justify-between items-center mb-2 bg-slate-700 p-2 rounded"
          >
            {user}
            <button
              onClick={() => deleteUser(user)}
              className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

    </div>
  );
}

export default UserManager;