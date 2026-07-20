import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../api/AuthContext";

const Login = () => {
    // Test uchun dummyjson'ning valid ma'lumotlari
    const [username, setUsername] = useState("kminchelle");
    const [password, setPassword] = useState("0lelplR");
    const { login, isLoggingIn, error, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Agar foydalanuvchi allaqachon tizimga kirgan bo'lsa, dashboard'ga yo'naltirish
        if (isAuthenticated) navigate("/dashboard", { replace: true });
    }, [isAuthenticated, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) {
            // Oddiy validatsiya
            // Yaxshiroq validatsiya/xabar berish tizimidan foydalanish mumkin (masalan, toast)
            alert("Foydalanuvchi nomi va parolni to'ldiring!");
            return;
        }
        // AuthContext'dan olingan login funksiyasini chaqiramiz.
        // U o'z ichida API so'rovini, holatni yangilashni va yo'naltirishni boshqaradi.
        login({ username: username.trim(), password: password.trim() });
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <form
                onSubmit={handleSubmit}
                style={{
                    width: "350px",
                    padding: "2rem",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    borderRadius: "8px",
                }}
            >
                <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                    Tizimga kirish
                </h2>
                {error && (
                    <p style={{ color: "red", textAlign: "center" }}>
                        Login yoki parol xato!
                    </p>
                )}
                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor='username'>Foydalanuvchi nomi:</label>
                    <input
                        id='username'
                        type='text'
                        value={username}
                        autoComplete='username'
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isLoggingIn}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px",
                            boxSizing: "border-box",
                        }}
                    />
                </div>
                <div style={{ marginBottom: "1.5rem" }}>
                    <label htmlFor='password'>Parol:</label>
                    <input
                        id='password'
                        type='password'
                        value={password}
                        autoComplete='current-password'
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoggingIn}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "5px",
                            boxSizing: "border-box",
                        }}
                    />
                </div>

                <button
                    type='submit'
                    disabled={isLoggingIn}
                    style={{
                        width: "100%",
                        padding: "12px",
                        cursor: "pointer",
                    }}
                >
                    {isLoggingIn ? "Kirilmoqda..." : "Kirish"}
                </button>
            </form>
        </div>
    );
};

export default Login;
