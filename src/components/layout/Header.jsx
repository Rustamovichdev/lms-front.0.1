import React from "react";

const Header = () => {
    const headerStyle = {
        padding: "1rem 2rem",
        background: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
        zIndex: 1,
    };
    return (
        <header style={headerStyle}>
            <h2>Boshqaruv paneli</h2>
        </header>
    );
};

export default Header;
