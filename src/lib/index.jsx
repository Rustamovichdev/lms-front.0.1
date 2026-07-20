import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
    const menuItems = [
        "Dashboard",
        "Lids",
        "O'qituvchilar",
        "Guruhlar",
        "Talabalar",
        "Moliya",
        "Sozlamalar",
    ];

    const sidebarStyle = {
        width: "240px",
        background: "#fff",
        height: "100vh",
        padding: "20px",
        boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
    };

    const listStyle = {
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    };

    const itemStyle = {
        padding: "15px 10px",
        cursor: "pointer",
        borderRadius: "5px",
    };

    return (
        <aside style={sidebarStyle}>
            <nav>
                <ul style={listStyle}>
                    {menuItems.map((item) => (
                        <Link
                            key={item}
                            style={itemStyle}
                            to={`/${item.toLowerCase()}`}
                        >
                            {item}
                        </Link>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
