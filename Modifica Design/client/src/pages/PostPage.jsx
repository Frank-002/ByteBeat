import React, { useEffect, useState } from 'react';
import { Spinner, Container, Row, Col} from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

export default function PostPage() {
    const { postSlug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [post, setPost] = useState(null);
    const [recentPosts, setRecentPosts] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
                const data = await res.json();
                if (!res.ok) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                setPost(data.posts[0]);
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchPost();
    }, [postSlug]);

    useEffect(() => {
        const fetchRecentPosts = async () => {
            try {
                const res = await fetch(`/api/post/getposts?limit=3`);
                const data = await res.json();
                if (res.ok) {
                    setRecentPosts(data.posts);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchRecentPosts();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <Spinner animation="border" role="status" size="xl">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <h1 className="text-danger">Errore caricamento post</h1>
            </div>
        );
    }

    return (
        <>
            <div className="jumbotron jumbotron-fluid text-white bg-dark">
                <Container className="text-center">
                    <h1 className="display-3">{post.title}</h1>
                    <p className="lead mb-2">
                        Categoria: {post.category}
                    </p>

                </Container>
            </div>

            <Container className="py-3 min-vh-100">
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <div className="mt-4 p-4 bg-light border rounded shadow-sm">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="img-fluid rounded mb-4"
                                style={{ maxHeight: '400px', objectFit: 'cover' }}
                            />
                            <div className="d-flex justify-content-between w-100 mt-3 border-bottom pb-2">
                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                <span className="fst-italic">
                  {(post.content.length / 1000).toFixed(0)} minuti letti
                </span>
                            </div>
                            <div
                                className="mt-4"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                                style={{ maxWidth: '100%', width: '100%' }}
                            ></div>
                        </div>

                        <CommentSection postId={post._id}/>
                    </Col>
                </Row>

                <Row className="mt-5">
                    <Col>
                        <h2 className="h4 text-center">Articoli recenti</h2>
                        <Row className="justify-content-center mt-3">
                            {recentPosts &&
                                recentPosts.map((recentPost) => (
                                    <Col key={recentPost._id} md={4} className="mb-3">
                                        <PostCard post={recentPost} />
                                    </Col>
                                ))}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    );
}


