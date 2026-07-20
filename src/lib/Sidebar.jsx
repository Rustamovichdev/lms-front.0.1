import React from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
    { path: "/dashboard", name: "Dashboard" },
    { path: "/leads", name: "Lidlar" },
    { path: "/teachers", name: "O'qituvchilar" },
    { path: "/groups", name: "Guruhlar" },
    { path: "/students", name: "O'quvchilar" },
    { path: "/finance", name: "Moliya" },
    { path: "/settings", name: "Sozlamalar" },
];

const Sidebar = () => {
    const sidebarStyle = {
        width: "250px",
        background: "#2c3e50",
        color: "#ecf0f1",
        padding: "1rem",
    };

    const logoStyle = {
        fontSize: "1.5rem",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "2rem",
    };

    const navLinkStyle = {
        display: "block",
        color: "#ecf0f1",
        padding: "1rem",
        borderRadius: "4px",
        textDecoration: "none",
        marginBottom: "0.5rem",
        transition: "background 0.2s",
    };

    const activeLinkStyle = {
        background: "#3498db",
        color: "#fff",
    };

    return (
        <aside style={sidebarStyle}>
            <div style={logoStyle}>LMS Platform</div>
            <nav>
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                style={({ isActive }) =>
                                    isActive
                                        ? {
                                              ...navLinkStyle,
                                              ...activeLinkStyle,
                                          }
                                        : navLinkStyle
                                }
                            >
                                {item.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
