import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../lib/Sidebar.jsx"; // To'g'ri Sidebar komponentini import qilamiz
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Header />
                <main
                    style={{ flex: 1, padding: "2rem", background: "#f4f6f8" }}
                >
                    <Outlet /> {/* Ichki sahifalar shu yerda ko'rinadi */}
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default Layout;
