import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import SharedNote from "./pages/Home/SharedNote";
import Groups from "./pages/Groups/Groups";
import CreateGroup from "./pages/Groups/CreateGroup";
import GroupDetails from "./pages/Groups/GroupDetails";

function App() {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<Root />} />
                    <Route path="/dashboard" exact element={<Home />} />
                    <Route path="/login" exact element={<Login />} />
                    <Route path="/signUp" exact element={<SignUp />} />
                    <Route path="/shared/:token" element={<SharedNote />} />
                    <Route path="/groups" element={<Groups />} />
                    <Route path="/groups/create" element={<CreateGroup />} />
                    <Route path="/groups/:groupId" element={<GroupDetails />} />


                </Routes>
            </Router>
        </div>
    );
}

const Root = () => {
    const isAuthenticated = !!localStorage.getItem("token");

    return isAuthenticated ? (
        <Navigate to="/dashboard" />
    ) : (
        <Navigate to="/login" />
    );
};

export default App;
