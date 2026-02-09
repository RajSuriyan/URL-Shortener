import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavbarMod from "./components/NavbarMod";
import AuthProvider from './context/AuthContext';
import About from "./pages/About";
import Contact from './pages/Contact';
import LandingPage from "./pages/landingPage";
import Login from "./pages/login";
import Logout from "./pages/Logout";
import NotFound from "./pages/NotFound";
import Profile from './pages/Profile';
import Signup from './pages/Signup';
function App() {

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <BrowserRouter>
        <AuthProvider>
          <NavbarMod />
            <Routes>
              <Route
              path = "/"
              element = {
                <LandingPage />
              }/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/logout" element={<Logout/>}/>
              <Route path="/signup" element={<Signup/>}/>
              <Route path="/profile" element={<Profile/>}/>
              <Route path="/about" element={<About/>}/>
              <Route path="/contact" element={<Contact/>}/>
              <Route
              path = "/home"
              element = {
                <LandingPage />
              }/>


              <Route path="*" element={<NotFound/>}/>


            </Routes>
        </AuthProvider>

         </BrowserRouter>
    <footer className="text-center text-lg mt-auto py-20 text-gray-600">
        © {new Date().getFullYear()} Raj Suriyan G
    </footer>
    </div>
  )
}

export default App
