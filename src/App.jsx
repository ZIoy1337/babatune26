// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./store/AuthContext";
import { LikedProvider } from "./store/LikedContext";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import Library from "./pages/Library/Library";
import History from "./pages/History/History";
import Liked from "./pages/Liked/Liked";
import Settings from "./pages/Settings/Settings";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

export default function App() {
    return (
        <AuthProvider>
            <LikedProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route element={<MainLayout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/library" element={<Library />} />
                            <Route path="/history" element={<History />} />
                            <Route path="/liked" element={<Liked />} />
                            <Route path="/settings" element={<Settings />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </LikedProvider>
        </AuthProvider>
    );
}