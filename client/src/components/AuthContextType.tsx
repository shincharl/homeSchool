import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
    isLoggedIn: boolean;
    setIsLoggedIn: (val: boolean) => void;
    nickname: string | null;
    setNickname: (val: string | null) => void;
    timeLeft: number; // 남은 시간(ms)
    resetTimer: () => void; // 타이머 초기화
    handleLogout: () => void;
}

const SESSION_TIMER = 30 * 60 * 1000; // 30분
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem("isLoggedIn") === "true";
    });

    const [nickname, setNickname] = useState<string | null>(() => {
        return localStorage.getItem("nickname");
    });

    // 남은 시간 초기화
    const [timeLeft, setTimeLeft] = useState<number>(() => {
        const logoutAt = localStorage.getItem("logoutAt");
        return logoutAt ? Math.max(parseInt(logoutAt) - Date.now(), 0) : SESSION_TIMER;
    });

    // 로그인 상태가 바뀔 때마다 localStorage에 저장
    useEffect(() => {
        localStorage.setItem("isLoggedIn", isLoggedIn ? "true" : "false");
    }, [isLoggedIn]);

    // nickname 저장
    useEffect(() => {
        if (nickname) {
            localStorage.setItem("nickname", nickname);
        } else {
            localStorage.removeItem("nickname");
        }
    }, [nickname]);

    // 타이머 실행
    useEffect(() => {
        if (!isLoggedIn) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if(prev <= 1000) {
                    handleLogout();
                    return 0;
                }
                return prev - 1000;
            });
        }, 1000);

        return () => clearInterval(interval); 
    }, [isLoggedIn]);

    // localStorage에 만료시간 저장
    useEffect(() => {

        if(isLoggedIn){
            localStorage.setItem("logoutAt", (Date.now() + timeLeft).toString());
        }else{
            localStorage.removeItem("logoutAt");
        }

    }, [timeLeft, isLoggedIn]);

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("nickname");
        localStorage.removeItem("logoutAt");
        setIsLoggedIn(false);
        setNickname(null);
        setTimeLeft(0);
        window.location.href = "/"; // 홈 이동
    };

    const resetTimer = () => setTimeLeft(SESSION_TIMER);

    return(
        <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn, nickname, setNickname, timeLeft, resetTimer, handleLogout}}>
                {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};