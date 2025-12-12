import { useNavigate, useParams } from "react-router-dom";
import BackToTop from "../components/BackToTop";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Styles from "../css/EditContent.module.css"
import { useEffect, useState } from "react";

interface ContactDTO {
    id: number;
    title: string;
    content: string;
    memberNickname: string;
}

const EditContact = () => {

    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [form, setForm] = useState<{title: string; content: string}>({
        title: "",
        content: "",
    });

    const [loading, setLoading] = useState(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    // id 바뀔때마다, (처음 로딩 포함) 기존 데이터 받아오기 
    useEffect(() => {
         fetch(`http://localhost:8080/api/contact/${id}`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        })
        .then((res) => res.json() as Promise<ContactDTO>)
        .then((data) => {
            setForm({title: data.title, content: data.content});
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
            setLoading(false);
        });
    }, [id]);

    // 수정 제출

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:8080/api/contact/${id}`, {
                method: "PUT",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(form),
            });

            if(res.ok) {
                alert("게시글이 수정되었습니다.");
                navigate(`/contact/${id}`); // 수정 후 상세 페이지로 이동
            } else {
                alert("수정에 실패했습니다.");
            }

        } catch (error) {
            console.log(error);
            alert("수정 중 오류 발생");
        }
    }

    if (loading) return <div className={Styles.loading}>불러오는 중...</div>;

    return (
        <>
            <div className={Styles.pageEnvelope}>
                <div className={Styles.wrap}>
                    <Header/>
                    <div className={Styles.content}>
                        <h2>게시글 수정</h2>
                        <form className={Styles.form} onSubmit={handleSubmit}>
                            <div className={Styles.inputGroup}>
                                <label>제목</label>
                                <input
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={Styles.inputGroup}>
                                <label>내용</label>
                                <textarea
                                    name="content"
                                    value={form.content}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button type="submit" className={Styles.submitBtn}>
                                 수정 완료
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer/>
            <BackToTop/>
        </>
    );
}

export default EditContact;