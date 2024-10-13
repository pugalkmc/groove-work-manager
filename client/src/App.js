import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
// import Home from "./components/home/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register"
import PrivateRoute from "./PrivateRoute";
// import FeedbackForm from "./components/home/FeedbackForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/console" element={<PrivateRoute/>}>
          <Route path="" element={<AdminConsole/>}>
            <Route path="project" element={<ProjectDetails/>}/>
            <Route path="source" element={<ProjectSource/>}/>
            <Route path="control" element={<BotControls/>}/>
            <Route path="expert" element={<ExpertHelp/>}/>
          </Route>
        </Route> */}
        {/* <Route path="feedback" element={<FeedbackForm/>}/> */}
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        {/* <Route path="*" element={<Home/>}></Route> */}
      </Routes>
  </BrowserRouter>
  )
}

export default App;