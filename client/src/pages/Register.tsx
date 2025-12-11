import { useState } from "react";
import BackToTop from "../components/BackToTop";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Styles from "../css/Register.module.css"
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [form, setForm] = useState({
        name: "",
        nickName: "",
        userId: "",
        password: "",
        email: "",
        address: "",
    });

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 비밀번호 검증
        const password = form.password;
        const minLength = 8;
        const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;

        if(password.length < minLength){
            alert(`비밀번호는 최소 ${minLength}자 이상이어야 합니다.`);
            return;
        }

        if(!specialCharPattern.test(password)) {
        alert("비밀번호에는 최소한 하나의 특수문자가 포함되어야 합니다.");
        return;
        }

        try {
            const res = await fetch("http://localhost:8080/api/register",{
                method:"POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(form),
            });

            if(res.ok){
                alert("회원가입 성공!");
                navigate("/login"); // 회원가입 후 로그인 페이지로 이동
            } else {
                const text = await res.text();
                alert("회원가입 실패: " + text);
            }
        } catch (error) {
            console.error(error);
            alert("회원가입 중 오류 발생");
        }
    };

    return (
        <>
            <div className={Styles.pageEnvelope}>
                <div className={Styles.wrap}>
                    <Header/>
                    <div className={Styles.content}>
                        
                        {/* 회원가입 폼 */}
                    <div className={Styles.loginBox}>
                    <h2>회원가입</h2>
                    <form className={Styles.form} onSubmit={handleSubmit}>
                        <div className={Styles.inputGroup}>
                        <label>이름</label>
                        <input
                            name="name"
                            placeholder="이름을 입력하세요"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                        </div>

                        <div className={Styles.inputGroup}>
                        <label>닉네임</label>
                        <input
                            name="nickName"
                            placeholder="닉네임을 입력하세요"
                            value={form.nickName}
                            onChange={handleChange}
                            required
                        />
                        </div>

                        <div className={Styles.inputGroup}>
                        <label>아이디</label>
                        <input
                            name="userId"
                            placeholder="아이디를 입력하세요"
                            value={form.userId}
                            onChange={handleChange}
                            required
                        />
                        </div>

                        <div className={Styles.inputGroup}>
                        <label>비밀번호</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                        </div>

                        <div className={Styles.inputGroup}>
                        <label>이메일</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="이메일을 입력하세요"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                        </div>

                        <div className={Styles.inputGroup}>
                        <label>주소</label>
                        <input
                            name="address"
                            placeholder="주소를 입력하세요"
                            value={form.address}
                            onChange={handleChange}
                        />
                        </div>

                        <button className={Styles.loginBtn} type="submit">
                        회원가입
                        </button>
                    </form>
                    </div>
                    </div>
                </div>
            </div>

            <Footer/>
            <BackToTop/>
        </>
    );
};

export default Register;