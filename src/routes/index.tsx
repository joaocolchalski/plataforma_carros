import { Route, Routes } from "react-router";
import PrivateApp from "./privateApp";

import Home from "../pages/Home";
import CarDetail from "../pages/CarDetail";
import Dashboard from "../pages/Dashboard";
import New from "../pages/Dashboard/New";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Error from "../pages/Error";

import LayoutHome from "../components/LayoutHome";

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<LayoutHome />}>
                <Route index element={<Home />} />
                <Route path="/car/:id" element={<CarDetail />} />
                <Route path="dashboard">
                    <Route index element={<PrivateApp><Dashboard /></PrivateApp>} />
                    <Route path="new" element={<PrivateApp><New /></PrivateApp>} />
                </Route>
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="*" element={<Error />} />
        </Routes>
    )
}