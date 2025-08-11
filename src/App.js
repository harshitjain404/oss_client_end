// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import IssueForm from './components/issueForm';
// import IssueList from './components/issueList'; // Ensure this exists
// import './App.css';
// import Footer from './components/footer'; // Ensure this exists
// import QuotationGenerator from './components/quotationGenerator'; // Ensure this exists
// import { Navigate } from "react-router-dom";
// import Cookies from "js-cookie";

// function App() {
//   return (
//     <Router>
//       <div className="App">
//        <header className="app-header">
//   <h1 className="app-title">One Stop Solutions</h1>
//   <nav className="app-nav">
//     <Link to="/" className="nav-link">New Issue</Link>
//     <Link to="/issues" className="nav-link">View Issues</Link>
//     <Link to="/quotation" className="nav-link">Create Quotation</Link>
//   </nav>
// </header>


//         <main className="mt-6">
//           <Routes>
//             <Route path="/" element={<IssueForm />} />
//             <Route path="/issues" element={<IssueList />} />
//             <Route path="/quotation" element={<QuotationGenerator />} />
//           </Routes>
//         </main>
//         <Footer />
//       </div>
//     </Router>
//   );
// }

// export default App;


import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import IssueForm from './components/issueForm';
import IssueList from './components/issueList';
import './App.css';
import Footer from './components/footer';
import QuotationGenerator from './components/quotationGenerator';
import Cookies from 'js-cookie';
import AdminLogin from "./components/adminLogin" // You'll need to create this component

// ProtectedRoute component
function ProtectedRoute({ element }) {
  const token = Cookies.get('adminToken'); // check if admin is logged in
  return token ? element : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <h1 className="app-title">One Stop Solutions</h1>
          <nav className="app-nav">
            <Link to="/" className="nav-link">New Issue</Link>
            <Link to="/issues" className="nav-link">View Issues</Link>
            <Link to="/quotation" className="nav-link">Create Quotation</Link>
            {Cookies.get('adminToken') && (
              <button
                onClick={() => {
                  Cookies.remove('adminToken');
                  window.location.href = '/login';
                }}
                className="nav-link"
              >
                Logout
              </button>
            )}
          </nav>
        </header>

        <main className="mt-6">
          <Routes>
            <Route path="/" element={<IssueForm />} />
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/issues" element={<ProtectedRoute element={<IssueList />} />} />
            <Route path="/quotation" element={<ProtectedRoute element={<QuotationGenerator />} />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
