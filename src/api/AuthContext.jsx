import React, { createContext, useContext, useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login as loginApi, getMe } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Foydalanuvchini tekshirish holati
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Ilova ochilganda yoki sahifa yangilanganda tokenni tekshirish
    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                try {
                    // Token orqali foydalanuvchi ma'lumotlarini olish
                    const currentUser = await getMe();
                    setUser(currentUser);
                } catch (error) {
                    // Agar token yaroqsiz bo'lsa yoki xatolik yuz bersa, tizimdan chiqaramiz
                    console.error(
                        "Token orqali foydalanuvchini aniqlashda xatolik:",
                        error,
                    );
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken"); // refreshToken'ni ham tozalaymiz
                    setUser(null);
                }
            }
            // Tekshiruv tugagach, yuklanish holatini o'chiramiz
            setIsLoading(false);
        };

        checkUser();
    }, []); // Bu faqat bir marta, komponent ilk render bo'lganda ishga tushadi

    const {
        mutate: login,
        isPending: isLoggingIn,
        error,
    } = useMutation({
        mutationFn: loginApi,
        onSuccess: (loggedInUser) => {
            // 1. Foydalanuvchi ma'lumotini state'ga joylash
            setUser(loggedInUser);

            // 2. Tokenlarni localStorage'ga saqlash
            localStorage.setItem("accessToken", loggedInUser.token); // dummyjson "token" qaytaradi, uni accessToken sifatida ishlatamiz
            // Agar refreshToken ham kelsa, uni ham saqlash mumkin: localStorage.setItem("refreshToken", loggedInUser.refreshToken);

            // 3. Foydalanuvchini asosiy sahifaga yo'naltirish
            navigate("/dashboard"); // Yoki boshqa asosiy sahifa
        },
        onError: (err) => {
            console.error("Login xatosi:", err.message);
        },
    });

    const logout = () => {
        setUser(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        queryClient.clear(); // TanStack Query cache'ini tozalash
        navigate("/login");
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading, // Bu holatni ProtectedRoute va PublicRoute'da ishlatamiz
        login,
        logout,
        isLoggingIn,
        error,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

// Context'ni oson ishlatish uchun custom hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
