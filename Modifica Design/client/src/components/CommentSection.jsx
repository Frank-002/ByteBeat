import React, { useEffect, useState } from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';
import { useUser } from './UserContext'; 
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function CommentSection({ postId }) {
  const { currentUser } = useUser();
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {
      const res = await fetch('/api/comment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment('');
        setCommentError(null);
        setComments([data, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: 'PUT',
      });
      if (res.ok) {
        const data = await res.json();
        setComments(
            comments.map((comment) =>
                comment._id === commentId
                    ? {
                      ...comment,
                      likes: data.likes,
                      numberOfLikes: data.likes.length,
                    }
                    : comment
            )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
        comments.map((c) =>
            c._id === comment._id ? { ...c, content: editedContent } : c
        )
    );
  };

  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const data = await res.json();
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
      <div className="container py-3">
        {currentUser ? (
            <div className="d-flex align-items-center gap-1 my-3 text-secondary">
              <p>Autenticato come:</p>
              <img
                  className="rounded-circle"
                  src={currentUser.profilePicture}
                  alt=""
                  style={{ width: '30px', height: '30px', objectFit: 'cover' }}
              />
              <Link
                  to={'/dashboard?tab=profile'}
                  className="text-info text-decoration-none"
              >
                @{currentUser.username}
              </Link>
            </div>
        ) : (
            <div className="text-secondary my-3">
              Devi essere autenticato per commentare.{' '}
              <Link to={'/sign-in'} className="text-info text-decoration-none">
                Accedi
              </Link>
            </div>
        )}
        {currentUser && (
            <form onSubmit={handleSubmit} className="border rounded p-3 mb-3">
          <textarea
              className="form-control mb-3"
              placeholder="Aggiungi un commento..."
              rows="3"
              maxLength="200"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
          />
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-secondary">
                  {200 - comment.length} caratteri rimanenti
                </small>
                <Button  variant="primary" type="submit">
                  Invia
                </Button>
              </div>
              {commentError && <Alert variant="danger">{commentError}</Alert>}
            </form>
        )}
        {comments.length === 0 ? (
            <p className="text-secondary my-3">Ancora nessun commento!</p>
        ) : (
            <>
              <div className="text-secondary my-3 d-flex align-items-center gap-1">
                <p>Commenti</p>
                <div className="border border-secondary rounded p-1">
                  <p>{comments.length}</p>
                </div>
              </div>
              {comments.map((comment) => (
                  <Comment
                      key={comment._id}
                      comment={comment}
                      onLike={handleLike}
                      onEdit={handleEdit}
                      onDelete={(commentId) => {
                        setShowModal(true);
                        setCommentToDelete(commentId);
                      }}
                  />
              ))}
            </>
        )}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Elimina Commento</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <HiOutlineExclamationCircle className="text-warning mb-3" size={40} />
            <p className="mb-3">Sei sicuro di voler eliminare questo commento?</p>
            <div className="d-flex justify-content-center">
              <Button
                  variant="danger"
                  className="me-2"
                  onClick={() => handleDelete(commentToDelete)}
              >
                Sì, elimina
              </Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Annulla
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
  );
}

