import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Comment.css";

const Comment = ({ bookId, book }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [user, setUser] = useState(null);

  console.log("book", book);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:9191/api/books/${bookId}/comments`);
        // Sắp xếp các bình luận theo thứ tự mới nhất đến cũ nhất
        const sortedComments = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setComments(sortedComments);
      } catch (error) {
        console.error("Fetch comments failed:", error);
      }
    };
    fetchComments();
  }, [bookId]);

  const handleCommentSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập trước khi bình luận");
      return;
    }

    if (!user || !user.userName) {
      toast.error("Tên người dùng không khả dụng");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:9191/api/books/${bookId}/comments`,
        { text: commentText, userId: user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments([response.data, ...comments]);
      setCommentText("");
      toast.success("Bình luận đã được thêm");
    } catch (error) {
      console.error("Submit comment failed:", error);
      toast.error("Gửi bình luận thất bại");
    }
  };

  const handleCommentDelete = async (commentId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập trước khi xóa bình luận");
      return;
    }

    try {
      await axios.delete(`http://localhost:9191/api/books/${bookId}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setComments(comments.filter(comment => comment.id !== commentId));
      toast.success("Bình luận đã được xóa");
    } catch (error) {
      console.error("Delete comment failed:", error);
      toast.error("Xóa bình luận thất bại");
    }
  };

  const isAdmin = user && user.role === "ADMIN"; // Giả sử rằng vai trò của người dùng được lưu trong thuộc tính 'role'

  return (
    <>
      <div className="comments-section">
        <h3>Bình luận</h3>
        <div className="comment-input-section">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Viết bình luận..."
            className="comment-input"
          ></textarea>
          <button onClick={handleCommentSubmit} className="submit-comment">
            Gửi bình luận
          </button>
        </div>
        <ul className="comment-list">
          {comments.map((comment) => (
            <li key={comment.id} className="comment-item">
              <img
                className="comment-avatar"
                src={comment.user && comment.user.avatar ? `http://localhost:9191/api/users/user-image/${comment.user.avatar}` : "default-avatar.png"}
                alt={`${comment.user ? comment.user.userName : "Unknown"}'s Avatar`}
              />
              <div className="comment-content">
                <div className="comment-header">
                  <strong>{comment.user ? comment.user.userName : "Unknown User"}</strong>
                  <span>{new Date(comment.createdAt).toLocaleString()}</span>
                  {isAdmin && (
                    <button
                      onClick={() => handleCommentDelete(comment.id)}
                      className="delete-comment"
                    >
                      Xóa
                    </button>
                  )}
                </div>
                <p style={{ backgroundColor: "#EEEEEE", borderRadius: "5px", padding: "15px", fontWeight: "500", textAlign: "left" }}>
                  {comment.text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Comment;
