import axios from "axios";
import api from "./axios"; // Markazlashgan axios sozlamalarini import qilamiz

const ROLES = {
    ADMIN: "👑 Admin",
    MANAGER: "👨‍💼 Manager",
    TEACHER: "👨‍🏫 Teacher",
    CALL_CENTER: "☎️ Call Center",
    ACCOUNTANT: "💰 Accountant",
    CASHIER: "💵 Cashier",
};

/**
 * Tizimga kirish uchun API so'rovi.
 * @param {object} credentials - Foydalanuvchining logini va paroli.
 * @param {string} credentials.username
 * @param {string} credentials.password
 * @returns {Promise<object>} To'liq foydalanuvchi ma'lumotlari.
 */
export const login = async (credentials) => {
    try {
        // `axios` o'rniga `api` instance'ini ishlatamiz.
        // `baseURL` allaqachon belgilangan, shuning uchun faqat endpointni yozamiz.
        const { data } = await api.post("/auth/login", credentials);

        // Backenddan kelgan rolni tekshiramiz.
        // Agar rol mavjud va bizning ROLES ro'yxatimizda bo'lsa, uni olamiz.
        // Aks holda, standart "Teacher" rolini beramiz.
        const assignedRole = Object.values(ROLES).includes(data.role)
            ? data.role
            : ROLES.TEACHER;

        const userWithRole = {
            ...data,
            role: assignedRole,
        };

        return userWithRole;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            // Backend'dan kelgan xatolikni to'g'ri formatda qaytaramiz.
            throw new Error(
                error.response.data.message || "Login yoki parol xato.",
            );
        }
        // Boshqa kutilmagan xatoliklar uchun umumiy xabar.
        throw new Error("Tizimga kirishda noma'lum xatolik yuz berdi.");
    }
};

/**
 * Token orqali joriy foydalanuvchi ma'lumotlarini olish.
 * @returns {Promise<object>} Foydalanuvchi ma'lumotlari.
 */
export const getMe = async () => {
    try {
        // Bu so'rov uchun `Authorization` headeri `axios` interceptor'i orqali avtomatik qo'shiladi.
        const { data } = await api.get("/auth/me");
        return data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(
                error.response.data.message || "Foydalanuvchini aniqlab bo'lmadi.",
            );
        }
        throw new Error("Foydalanuvchi ma'lumotlarini olishda xatolik.");
    }
};
