
import { useState } from 'react';
import BackToTop from '../components/BackToTop';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Styles from '../css/ContactNew.module.css';

const ContactNew = () => {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

        try {
            const response = await fetch("http://localhost:8080/contact/new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body : JSON.stringify({
                    title: title,
                    content: content,
                }),
            });

            if(!response.ok){
                throw new Error("서버 오류");
            }

            const result = await response.json();
            console.log("서버 응답:", result);

            alert("문의가 등록되었습니다!");
        } catch (error) {
            console.error(error);
            alert("문의 등록 실패!");
        }
    };

    return (
        <>
            <div className={Styles.pageEnvelope}> {/* 바깥 배경 */}
                <div className={Styles.wrap}>
                    <Header/>
                    <div className={Styles.content}>
                        
                        <div className={Styles.formContainer}>
                                <h2>문의 작성</h2>

                            <form onSubmit={handleSubmit}>

                                <div className={Styles.formGroup}>
                                    <label>제목</label>
                                        <input type="text"
                                            value={title}
                                            onChange = {(e) => setTitle(e.target.value)}
                                            placeholder="제목을 입력하세요" 
                                        />
                                </div>

                                <div className={Styles.formGroup}>
                                    <label>내용</label>
                                        <textarea 
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="내용을 입력하세요..."
                                            rows={30}
                                        />
                                </div>

                                <button type='submit' className={Styles.submitBtn}>
                                    작성하기
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
}

export default ContactNew;