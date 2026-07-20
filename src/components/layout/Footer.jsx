import React from "react";

const Footer = () => {
    const footerStyle = {
        padding: "1rem 2rem",
        background: "#fff",
        borderTop: "1px solid #e7e7e7",
        textAlign: "center",
    };
    return (
        <footer style={footerStyle}>
            <p>&copy; 2026 LMS Platformasi. Barcha huquqlar himoyalangan.</p>
        </footer>
    );
};

export default Footer;
