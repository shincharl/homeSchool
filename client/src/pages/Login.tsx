import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContextType';
import BackToTop from '../components/BackToTop';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Styles from '../css/Login.module.css'

const Login = () => {

    const { setIsLoggedIn, setNickname } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        try {
            const res = await fetch("http://localhost:8080/api/login", {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            if(res.ok){
                const data = await res.json();
                console.log("USER:", data);

                // AuthContext 상태 업데이트
                setIsLoggedIn(true);
                setNickname(data.nickname);

                // localStorage도 저장 (새로고침 대비)
                localStorage.setItem("nickname", data.nickname);
                localStorage.setItem("isLoggedIn", "true");
                navigate("/");
            } else {
                alert("로그인 실패");
            }
        } catch (error) {
            console.error("ERROR:", error);
            alert("로그인 중 오류 발생");
        }

    }

    return (
        <>
            <div className={Styles.pageEnvelope}>
                <div className={Styles.wrap}>
                    <Header/>
                    <div className={Styles.content}>
                        {/* 로그인 창!!! */}
                        <div className={Styles.loginBox}>
                            <h2>로그인</h2>

                            <form className={Styles.form} onSubmit={handleLogin}>
                                <div className={Styles.inputGroup}>
                                    <label>아이디</label>
                                    <input name="username" type="text" placeholder="아이디를 입력하세요" required/>
                                </div>

                                <div className={Styles.inputGroup}>
                                    <label>비밀번호</label>
                                    <input name="password" type="password" placeholder="비밀번호를 입력하세요" required/>
                                </div>

                                <button className={Styles.loginBtn} type="submit">로그인</button>

                                <div className={Styles.bottomLinks}>
                                    <Link to="/register">회원가입</Link>
                                    <a href="#">비밀번호 찾기</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Footer/>
            <BackToTop/>
        </>
    );
}

export default Login;