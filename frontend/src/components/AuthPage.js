import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const API_BASE_URL = window.location.origin;
  const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");

      try {
        const res = await fetch(`${API_BASE_URL}/api/token/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        });
        if (!res.ok) {
          throw new Error("Invalid username or password");
        }
        const data = await res.json();
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        navigate("/chat");

      } catch (err) {
        setError(err.message || "Login failed. Please try again.");
      }
    };

//  return (
//    <div className="flex justify-center items-center min-h-screen bg-gray-100">
//      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
//        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
//          {isLogin ? "Login" : "Sign Up"}
//        </h1>
//
//        {error && (
//          <div className="mb-4 text-red-500 text-sm text-center">
//            {error}
//          </div>
//        )}
//
//        <form onSubmit={handleSubmit} className="space-y-4">
//          <div>
//            <label className="block text-gray-600 mb-1">Username</label>
//            <input
//              type="text"
//              value={username}
//              onChange={(e) => setUsername(e.target.value)}
//              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
//              placeholder="Enter your username"
//              required
//            />
//          </div>
//
//          <div>
//            <label className="block text-gray-600 mb-1">Password</label>
//            <input
//              type="password"
//              value={password}
//              onChange={(e) => setPassword(e.target.value)}
//              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
//              placeholder="Enter your password"
//              required
//            />
//          </div>
//
//          <button
//            type="submit"
//            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
//          >
//            {isLogin ? "Login" : "Sign Up"}
//          </button>
//        </form>
//
//        <p className="text-center text-gray-600 mt-4">
//          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
//          <button
//            type="button"
//            onClick={() => setIsLogin(!isLogin)}
//            className="text-blue-500 hover:underline"
//          >
//            {isLogin ? "Sign Up" : "Login"}
//          </button>
//        </p>
//      </div>
//    </div>
//  );
//}

return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h1>

        {error && (
          <div className="mb-4 text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}