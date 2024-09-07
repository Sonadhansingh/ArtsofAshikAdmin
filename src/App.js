import { BrowserRouter, Routes, Route , useLocation} from "react-router-dom";
import Homepage from './components/Homepage';
import Navbar from "./components/Navbar";
import Character from "./components/Works/Character";
import Main from "./components/Works/Main";
import Environment from "./components/Works/Environment";
import Scripts from "./components/Scripts";
import Aboutpage from "./components/Aboutpage";
import Contact from "./components/Contact";
import SkillsAdmin from "./components/Skills/SkillsAdmin";
import Education from "./components/Education";
import Competences from "./components/Competences";
import Login from "./components/Login";
// import ProtectedRoute from "./ProtectedRoutes";';
import ProtectedRoute from "./ProtectedRoute";


function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={
          <ProtectedRoute> 
            <Homepage />
          </ProtectedRoute>
        } />
        <Route path="/main" element={<Main />} />
        <Route path="/character" element={<Character />} />
        <Route path="/environment" element={<Environment />} />
        <Route path="/scripts" element={<Scripts />} />
        <Route path="/about" element={<Aboutpage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/education" element={<Education />} />
        <Route path="/competences" element={<Competences />} />
        <Route path="/skills" element={<SkillsAdmin />} />
      </Routes>
    </>
  );
}

export default App;
