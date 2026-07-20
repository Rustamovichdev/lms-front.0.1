import axios from "axios";

// Asosiy API manzilini belgilaymiz. .env faylidan olish tavsiya etiladi.
const API_URL = "https://dummyjson.com";

// Axios uchun yangi instance yaratamiz.
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor: Har bir so'rov yuborilishidan oldin ishlaydi.
api.interceptors.request.use(
    (config) => {
        // localStorage'dan `authToken`ni olamiz.
        const token = localStorage.getItem("authToken");

        // Agar token mavjud bo'lsa, uni `Authorization` header'iga qo'shamiz.
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // So'rovdagi xatolikni qaytaramiz.
        return Promise.reject(error);
    },
);

// Response Interceptor: Serverdan javob kelgandan so'ng ishlaydi.
api.interceptors.response.use(
    (response) => response, // Agar xatolik bo'lmasa, javobni qaytaramiz.
    (error) => {
        // Agar serverdan 401 (Unauthorized) xatolik kelsa, foydalanuvchini tizimdan chiqaramiz.
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("authToken");
            window.location.href = "/login"; // Login sahifasiga yo'naltirish
        }
        return Promise.reject(error);
    },
);

export default api;
