import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavbarMod from "./components/NavbarMod";
import LandingPage from "./pages/landingPage";
import Login from "./pages/login";
import Logout from "./pages/Logout";
import NotFound from "./pages/NotFound";
function App() {

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <BrowserRouter>
        <NavbarMod />
          <Routes>
            <Route
            path = "/"
            element = {
              <LandingPage />
            }/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/logout" element={<Logout/>}/>
            <Route path="/register" element={<Logout/>}/>
            <Route path="*" element={<NotFound/>}/>
          </Routes>
         </BrowserRouter>
    <footer className="text-center text-lg mt-auto py-6 text-gray-600">
        © {new Date().getFullYear()} Raj Suriyan G
    </footer>
    </div>
  )
}

export default App
