import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import "../styles/appLayout.css";

function AppLayout() {
    const theme = useSelector((state) => state.ui.theme);
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);
    return (
        <div className="app-layout">
            <Sidebar/>
            <main className="app-main">
                <Outlet/>
            </main>
        </div>
    );
}

export default AppLayout;