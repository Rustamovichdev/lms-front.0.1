import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../lib/Sidebar.jsx"; // To'g'ri Sidebar komponentini import qilamiz
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                overflow: "hidden",
                boxSizing: "border-box",
            }}
        >
            <Sidebar />

            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    height: "100vh",
                    overflow: "hidden",
                }}
            >
                <Header />

                <main
                    style={{
                        flex: 1,
                        padding: "2rem",
                        background: "#f4f6f8",
                        overflowY: "auto",
                        boxSizing: "border-box",
                    }}
                >
                    <Outlet />
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default Layout;
