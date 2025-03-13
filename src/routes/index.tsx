import { Route, Routes } from "react-router";

import Home from "../pages/Home";
import CarDetail from "../pages/CarDetail";
import Dashboard from "../pages/Dashboard";
import New from "../pages/Dashboard/New";
import Login from "../pages/Login";
import Register from "../pages/Register";

import LayoutHome from "../components/LayoutHome";

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<LayoutHome />}>
                <Route index element={<Home />} />
                <Route path="/car/:id" element={<CarDetail />} />
                <Route path="dashboard">
                    <Route index element={<Dashboard />} />
                    <Route path="new" element={<New />} />
                </Route>
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    )
}