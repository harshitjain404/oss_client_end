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


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "admin", "admin");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { username: dbUser, password: dbPass } = docSnap.data();
        if (username === dbUser && password === dbPass) {
          // Set cookie for 2 hours
          Cookies.set("adminAuth", "true", { expires: 1 / 12 }); // 1/12 of a day = 2 hours
          navigate("/viewissues");
        } else {
          setError("Invalid username or password");
        }
      } else {
        setError("Admin credentials not found");
      }
    } catch (err) {
      setError("Error logging in: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "2rem" }}>
      <h2>Admin Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <button type="submit" style={{ width: "100%" }}>Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
