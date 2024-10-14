import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
// import Home from "./components/home/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register"
import PrivateRoute from "./PrivateRoute";
import Skills from "./components/skills/Skills";
import Profile from "./components/profile/Profile";
// import FeedbackForm from "./components/home/FeedbackForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PrivateRoute/>}>
          <Route path="skills" element={<Skills/>} />
          <Route path="*" element={<Profile/>} />
        </Route>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="*" element={<Skills/>} />
      </Routes>
  </BrowserRouter>
  )
}

export default App;