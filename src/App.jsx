import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import Login from "./features/auth/Login"; // Login sahifasini import qilamiz
import { useAuth } from "./api/AuthContext";
import Layout from "./components/layout"; // Yangi Layout komponentini import qilamiz
import Leads from "./Leads";
import Teachers from "./Teachers";
import Groups from "./Groups";
import Students from "./Students";
import Finance from "./Finance";
import Settings from "./Settings";

// Vaqtinchalik Dashboard komponenti
const Dashboard = () => {
    const { user, logout } = useAuth();
    return (
        <div style={{ padding: "2rem" }}>
            <h1>Xush kelibsiz, {user.firstName}!</h1>
            <p>Sizning rolingiz: {user.role}</p>
            <button onClick={logout}>Chiqish</button>
        </div>
    );
};

// Himoyalangan marshrutlar uchun komponent
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    // Foydalanuvchi holati tekshirilayotganda hech narsa ko'rsatmaymiz
    if (isLoading) return <div>Yuklanmoqda...</div>; // Yoki spinner qo'yish mumkin

    return isAuthenticated ? children : <Navigate to='/login' replace />;
};

// Tizimga kirgan foydalanuvchilar uchun ochiq sahifalarni cheklash (masalan, login)
const PublicRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) return <div>Yuklanmoqda...</div>; // Yoki spinner qo'yish mumkin

    return isAuthenticated ? <Navigate to='/dashboard' replace /> : children;
};

const App = () => {
    return (
        <Routes>
            <Route
                path='/login'
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />
            <Route
                path='/'
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                {/* Asosiy sahifa /dashboard'ga yo'naltiriladi */}
                <Route index element={<Navigate to='/dashboard' replace />} />
                <Route path='dashboard' element={<Dashboard />} />
                <Route path='leads' element={<Leads />} />
                <Route path='teachers' element={<Teachers />} />
                <Route path='groups' element={<Groups />} />
                <Route path='students' element={<Students />} />
                <Route path='finance' element={<Finance />} />
                <Route path='settings' element={<Settings />} />
            </Route>
            {/* Asosiy sahifaga kirganda /login'ga yo'naltirish */}
            <Route path='*' element={<Navigate to='/' />} />
        </Routes>
    );
};
export default App;
