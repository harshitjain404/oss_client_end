// // src/pages/AdminLogin.jsx
// import React, { useState } from "react";
// import Cookies from "js-cookie";
// import { auth } from "../firebase";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { useNavigate } from "react-router-dom";

// export default function AdminLogin() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
//       // Save login token in cookie (valid for 7 days)
//       Cookies.set("adminAuth", userCredential.user.uid, { expires: 7 });
      
//       navigate("/viewissues");
//     } catch (err) {
//       setError("Invalid email or password");
//     }
//   };

//   return (
//     <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
//       <h2>Admin Login</h2>
//       <form onSubmit={handleLogin}>
//         <input
//           type="email"
//           placeholder="Admin Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
//         />
//         {error && <p style={{ color: "red" }}>{error}</p>}
//         <button
//           type="submit"
//           style={{
//             width: "100%",
//             padding: "10px",
//             background: "blue",
//             color: "#fff",
//             border: "none",
//             cursor: "pointer"
//           }}
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }




// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
// import { auth } from "../firebase";
// import { signInWithEmailAndPassword } from "firebase/auth";

// const AdminLogin = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
// console.log("logged in!!!")
//       // ✅ Set 2-hour cookie for admin authentication
//       Cookies.set("adminAuth", "true", { expires: 1 / 12 }); // 1/12 of a day = 2 hours

//       navigate("/issues");
//     } catch (err) {
//       setError("Invalid email or password");
//       setEmail("");
//       setPassword("");
//     }
//   };

//   return (
//     <div style={{ maxWidth: "400px", margin: "auto", padding: "2rem" }}>
//       <h2>Admin Login</h2>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <form onSubmit={handleLogin}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           style={{ width: "100%", marginBottom: "1rem" }}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           style={{ width: "100%", marginBottom: "1rem" }}
//         />
//         <button type="submit" style={{ width: "100%" }}>Login</button>
//       </form>
//     </div>
//   );
// };

// export default AdminLogin;



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { auth } from "../firebase"; // Make sure firebase.js exports 'auth'
import { signInWithEmailAndPassword } from "firebase/auth";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Logged in:", userCredential.user.email);

      // Set 2-hour cookie
      const twoHours = 1 / 12; // 2 hours in days
      Cookies.set("adminAuth", "true", { expires: twoHours, sameSite: "Strict" });

      // Redirect to issues page without reload
      navigate("/issues", { replace: true });
    } catch (err) {
      console.error("❌ Login error:", err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "2rem" }}>
      <h2>Admin Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleLogin} noValidate>
        <input
          type="email"
          placeholder="Email"
          value={email}
          autoComplete="username"
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <button
          type="submit"
          style={{ width: "100%", padding: "0.5rem" }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
