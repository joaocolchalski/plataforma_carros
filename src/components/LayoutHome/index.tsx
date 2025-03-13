import Header from "../Header";
import { Outlet } from "react-router";

export default function LayoutHome() {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}