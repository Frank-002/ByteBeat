import React, { useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useUser } from './UserContext'; 
import "bootstrap/dist/css/bootstrap.min.css";

const DashComments = () => {
  const { currentUser } = useUser(); 
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getComments`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser && currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(
        `/api/comment/getComments?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='container my-5'>
      {currentUser && currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table responsive hover bordered className='shadow'>
            <thead className='bg-primary text-white'>
              <tr>
                <th>Date Updated</th>
                <th>Comment Content</th>
                <th>Number of Likes</th>
                <th>Post ID</th>
                <th>User ID</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => (
                <tr key={comment._id}>
                  <td>{new Date(comment.updatedAt).toLocaleDateString()}</td>
                  <td>{comment.content}</td>
                  <td>{comment.numberOfLikes}</td>
                  <td>{comment.postId}</td>
                  <td>{comment.userId}</td>
                  <td>
                    <Button
                      variant='danger'
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {showMore && (
            <Button
              variant='outline-info'
              className='w-100 mt-4'
              onClick={handleShowMore}
            >
              Show more
            </Button>
          )}
        </>
      ) : (
        <p className='text-center'>You have no comments yet!</p>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-center'>
          <HiOutlineExclamationCircle className='text-danger mb-4' size={48} />
          <h4 className='mb-4'>Are you sure you want to delete this comment?</h4>
          <div className='d-flex justify-content-center'>
            <Button variant='danger' onClick={handleDeleteComment}>
              Yes, delete
            </Button>{" "}
            <Button variant='secondary' onClick={() => setShowModal(false)}>
              No, cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DashComments;
