import { useEffect, useState } from 'react';
import BackToTop from '../components/BackToTop';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Styles from '../css/Contact.module.css';
import {Link} from "react-router-dom";

interface ContactDTO {
    id: number;
    title: string;
    memberNickname: string;
    createdAt: string;
    readCount: number;
}

const Contact = () => {

    const [posts, setPosts] = useState<ContactDTO[]>([]);
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [keyword, setKeyword] = useState<string>(""); // 검색어

    const size = 10; // 한 페이지 글 수

    // 컴포넌트가 마운트될 때 API 호출
    useEffect(() => {

        const query = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });

        if(keyword) query.append("keyword", keyword);


        fetch(`http://localhost:8080/api/contacts?${query.toString()}`, {
            method: "GET",
            credentials: "include", // 쿠키 전송
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            setPosts(data.content); // Page 객체의 content
            setTotalPages(data.totalPages); // Page 객체의 totalPages
        }).catch(error => console.error('Error fetching contacts:', error));
    }, [page, keyword]);

    const handlePrev = () => setPage(prev => Math.max(prev - 1, 0));
    const handleNext = () => setPage(prev => Math.min(prev + 1, totalPages - 1));

    return (
        <>
            <div className={Styles.pageEnvelope}> {/* 바깥 배경 */}
                <div className={Styles.wrap}>
                    <Header/>
                    <div className={Styles.content}>
                        
                        <h2>문의 게시판</h2>

                        <div className={Styles.searchContainer}>
                            <input type="text"
                                   placeholder="제목 또는 닉네임 검색"
                                   value={keyword}
                                   onChange={(e) => setKeyword(e.target.value)}
                                   onKeyDown={(e) => {if(e.key === 'Enter') setPage(0)}} 
                            />
                            <button onClick={() => setPage(0)}>검색</button>
                        </div>

                        <table className={Styles.table}>
                            <thead>
                                <tr>
                                    <th>제목</th>
                                    <th>닉네임</th>
                                    <th>날짜</th>
                                    <th>조회수</th>
                                </tr>
                            </thead>

                            <tbody>
                               {posts.map(post => (
                                    <tr key={post.id} className={Styles.row}>
                                        <td data-label="제목">
                                            <Link to={`/contact/${post.id}`} className={Styles.link}>
                                                {post.title}
                                            </Link>
                                        </td>   
                                        <td data-label="닉네임">{post.memberNickname}</td>
                                        <td data-label="날짜">
                                            {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                                        </td>
                                        <td data-label="조회수">{post.readCount}</td>
                                    </tr>
                               ))}
                            </tbody>
                        </table>
                        
                        {/* 페이지 버튼 */}
                        <div className={Styles.pagination}>
                               <button onClick={handlePrev} disabled={page === 0}>이전</button>
                               <span>{page + 1} / {totalPages}</span>
                               <button onClick={handleNext} disabled={page + 1 >= totalPages}>다음</button>
                        </div>

                        <div className={Styles.writeBtnContainer}>
                            <Link to="/contact/new" className={Styles.writeBtn}> 작성하기 </Link>
                        </div>

                    </div>
                </div>
            </div>

            <Footer/>
            <BackToTop/>
        </>
    );
}

export default Contact;