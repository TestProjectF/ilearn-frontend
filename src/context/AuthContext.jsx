import { createContext, useContext, useState, useEffect } from 'react';
import { getProfileApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Khi app khởi động, kiểm tra token còn hợp lệ không
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        // Kiểm tra token có hết hạn chưa (decode JWT đơn giản)
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.exp * 1000 < Date.now()) {
                // Token hết hạn
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setLoading(false);
                return;
            }
        } catch {
            localStorage.removeItem('token');
            setLoading(false);
            return;
        }

        getProfileApi()
            .then((res) => setUser(res.data.user))
            .catch(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            })
            .finally(() => setLoading(false));
    }, []);

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);