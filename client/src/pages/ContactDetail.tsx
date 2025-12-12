import { Link ,useNavigate,useParams } from 'react-router-dom';
import Header from '../components/Header';
import Styles from '../css/ContactDetail.module.css';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import { useAuth } from '../components/AuthContextType';

interface ContactDTO {
    id: number;
    title: string;
    content: string;
    memberNickname: string;
    createdAt: string;
    readCount: number;
}

const ContactDetail = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const { nickname } = useAuth();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:8080/api/contact/${id}`, {
            method: "GET",
            credentials: "include",
            headers: {"Content-Type": "application/json"}
        })
            .then(res => res.json())
            .then(data => {
                setPost(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, [id]);

    const handleDelete = () => {
        if(!window.confirm("게시물을 삭제하시겠습니까?")) return;

        fetch(`http://localhost:8080/api/contact/${id}`, {
            method: "DELETE",
            credentials: "include",
        })
        .then(res => {
            if(res.ok){
                alert("게시글이 삭제되었습니다.");
                navigate("/contacts"); // 삭제 후 목록으로 이동
            }else {
                alert("삭제에 실패했습니다.");
            }
        })
        .catch(err => console.error(err));
    }

    if(loading) return <div className={Styles.loading}>불러오는 중...</div>;

    if(!post) return <div className={Styles.error}>게시글을 찾을 수 없습니다.</div>

    return (
        <>
            <div className={Styles.pageEnvelope}>
                <div className={Styles.wrap}>
                    <Header/>
                    <div className={Styles.content}>
                        <h2 className={Styles.title}>{post.title}</h2>

                        <div className={Styles.info}>
                            <span>작성자: {post.memberNickname}</span>
                            <span>조회수: {post.readCount}</span>
                            <span>
                                날짜: {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                            </span>
                        </div>

                        <div className={Styles.bodyBox}>
                            {post.content}
                        </div>

                        <div className={Styles.btnWrap}>
                            <Link to="/contacts" className={Styles.backBtn}>
                                목록으로 돌아가기
                            </Link>

                            {nickname?.trim() === post.memberNickname?.trim() && (
                                <>
                                    <button className={Styles.deleteBtn} onClick={handleDelete}>삭제하기</button>
                                    <button className={Styles.editBtn} onClick={() => navigate(`/contact/edit/${post.id}`)}>수정하기</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer/>
            <BackToTop/>
        </>
    );
}

export default ContactDetail;