import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./StaffOrderManagement.css";
import Header from "../../pages/nav-bar/Header";
import empty_state from "../../assets/empty_state.png";
import { FaSearch } from "react-icons/fa";
import { UserContext } from "../../ultils/userContext";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { Button } from "react-bootstrap";

Modal.setAppElement("#root");

function StaffOrderManagement() {
  const userStaffOrder = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (
      !userStaffOrder ||
      !userStaffOrder.role ||
      userStaffOrder.role !== "STAFF"
    ) {
      navigate("/signin");
    }
  }, [userStaffOrder, navigate]);

  const [orderID, setOrderID] = useState("");
  const [orders, setOrders] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [originalStatus, setOriginalStatus] = useState({});
  const token = localStorage.getItem("token");
  const { user } = useContext(UserContext);

  // State for file and preview
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [webcamOpen, setWebcamOpen] = useState(false);
  const [webcamImage, setWebcamImage] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const webcamRef = useRef(null);

  const handleFileChange = (e, orderID) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile({ file, orderID });
      const previewURL = URL.createObjectURL(file);
      setPreviewURL(previewURL);
    }
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setWebcamImage(imageSrc);
    setWebcamOpen(false);
    setSelectedFile({
      file: dataURLtoFile(imageSrc, "webcam.jpg"),
      orderID: selectedOrder.orderDetailID,
    });
    setPreviewURL(imageSrc);
  };

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleUpdateOrder = async (orderID, status, returnDate) => {
    try {
      if (status === "Returned") {
        returnDate = new Date().toISOString();
      } else if (status === "Borrowed" && new Date(returnDate) < new Date()) {
        toast.error("Không thể chọn thời gian trong quá khứ");
        return;
      }

      const formData = new FormData();
      const payload = { status, returnDate };
      formData.append("payload", JSON.stringify(payload));

      await axios.put(
        `http://localhost:9191/api/orders/${orderID}/return`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Order updated successfully");
      const updatedOrders = orders.map((order) =>
        order.orderDetailID === orderID
          ? { ...order, status, returnDate }
          : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      toast.error("Failed to update order");
    }
  };

  const handleFileUpload = async (orderID) => {
    if (!selectedFile) return;

    const formData = new FormData(); // Tạo đối tượng để chứa dữ liệu file
    formData.append("file", selectedFile.file); // Chỉ thêm tệp hình ảnh

    try {
      await axios.put(
        `http://localhost:9191/api/orders/${orderID}/return`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", //gửi kèm dữ liệu dạng multipart
          },
        }
      );
      toast.success("Tải lên thành công !");
      setSelectedFile(null);
      setPreviewURL(null);
      handleSearchOrder();
    } catch (error) {
      toast.error("Failed to upload file");
    }
  };

  const handleCompensateOrder = async (orderID, compensationType) => {
    const confirmMessage = `Bạn đã chắn chắn muốn thay đổi trạng thái thành đền ${
      compensationType === "money" ? "tiền" : "sách"
    } không?`;
    if (window.confirm(confirmMessage)) {
      try {
        const status =
          compensationType === "money"
            ? "Compensated by Money"
            : "Compensated by Book";

        const localDate = new Date();
        const offset = localDate.getTimezoneOffset() * 60000;
        const localISOTime = new Date(localDate - offset)
          .toISOString()
          .slice(0, -1);

        const formData = new FormData();
        const payload = { status, returnDate: localISOTime };
        formData.append("payload", JSON.stringify(payload));

        await axios.put(
          `http://localhost:9191/api/orders/${orderID}/return`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success(
          `Đổi trạng thái thành công thành đền ${
            compensationType === "money" ? "tiền" : "sách"
          }`
        );

        const updatedOrders = orders.map((order) =>
          order.orderDetailID === orderID
            ? { ...order, status, returnDate: localISOTime }
            : order
        );
        setOrders(updatedOrders);
      } catch (error) {
        toast.error("Failed to compensate order");
      }
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSearchOrder = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9191/api/orders/search/${orderID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(response.data);
      setOriginalStatus(
        response.data.reduce((acc, order) => {
          acc[order.orderDetailID] = order.status;
          return acc;
        }, {})
      );
      toast.success("Kết quả thành công !");
    } catch (error) {
      toast.error("Không tìm thấy đơn hàng hợp lệ !");
      setOrders([]);
    }
  };

  const handleImageClick = (imagePath) => {
    setCurrentImage(imagePath);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
    setCurrentImage("");
  };

  return (
    <>
      <Header />

      <div className="StaffOrderManagement container mt-12">
        <ToastContainer />
        <h1>Quản Lý Mượn-Trả Sách</h1>
        <div className="search-section d-flex mb-3">
          <input
            type="text"
            className="form-control me-2"
            value={orderID}
            onChange={(e) => setOrderID(e.target.value)}
            placeholder="Vui lòng nhập mã đơn hàng"
          />
          <Button onClick={handleSearchOrder}>
            <FaSearch style={{ padding: "0 10px 0 0", fontSize: "170%" }} />
            Search
          </Button>
        </div>

        {orders.length > 0 ? (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Ảnh Sách</th>
                <th>Tên Khách Hàng</th>
                <th>Số Lượng</th>
                <th>Tên Sách</th>
                <th>Tiền</th>
                <th>Thời Gian Mượn</th>
                <th>Trạng Thái</th>
                <th>Thời Gian Trả</th>
                <th>Ảnh Biên Bản</th>
                <th>Xác Nhận</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const localReturnDate = new Date(
                  order.returnDate
                ).toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });
                return (
                  <tr key={order.orderDetailID}>
                    <td>
                      <img
                        src={`http://localhost:9191/api/books/images/${order.bookImage}`}
                        alt={order.bookName}
                        className="img-fluid"
                        style={{ maxWidth: "120px" }}
                      />
                    </td>
                    <td>{order.userName}</td>
                    <td>{order.quantity}</td>
                    <td>{order.bookName}</td>
                    <td>{order.totalPrice}</td>
                    <td>{new Date(order.orderDate).toLocaleString()}</td>
                    <td>
                      <select
                        className="form-select"
                        value={order.status}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          const updatedOrders = orders.map((o) =>
                            o.orderDetailID === order.orderDetailID
                              ? {
                                  ...o,
                                  status: newStatus,
                                  returnDate:
                                    newStatus === "Returned"
                                      ? new Date().toISOString()
                                      : o.returnDate,
                                }
                              : o
                          );
                          setOrders(updatedOrders);
                        }}
                      >
                        <option value="Pending" disabled>
                          Đang chờ
                        </option>
                        <option value="Borrowed">Đang mượn</option>
                        <option value="Returned">Đã trả</option>
                        <option value="Overdue" disabled>
                          Quá hạn
                        </option>
                        <option value="Cancelled" disabled>
                          Bị hủy
                        </option>
                        <option value="Compensated by Money" disabled>
                          Đền tiền sách
                        </option>
                        <option value="Compensated by Book" disabled>
                          Đền sách
                        </option>
                      </select>
                      {originalStatus[order.orderDetailID] === "Borrowed" && (
                        <button
                          className="btn btn-danger btn-sm mt-2"
                          onClick={() => openModal(order)}
                          disabled={[
                            "Compensated by Money",
                            "Compensated by Book",
                            "Overdue",
                            "Pending",
                            "Cancelled",
                            "Returned",
                          ].includes(order.status)}
                        >
                          Xử lý mất sách
                        </button>
                      )}
                    </td>
                    <td>
                      {order.status === "Returned" ||
                      order.status === "Compensated by Money" ||
                      order.status === "Compensated by Book" ? (
                        localReturnDate
                      ) : (
                        <input
                          type="datetime-local"
                          className="form-control"
                          value={new Date(order.returnDate)
                            .toISOString()
                            .slice(0, 16)}
                          onChange={(e) => {
                            const updatedOrders = orders.map((o) =>
                              o.orderDetailID === order.orderDetailID
                                ? { ...o, returnDate: e.target.value }
                                : o
                            );
                            setOrders(updatedOrders);
                          }}
                          disabled={[
                            "Compensated by Money",
                            "Compensated by Book",
                            "Overdue",
                            "Pending",
                            "Cancelled",
                            "Returned",
                          ].includes(order.status)}
                        />
                      )}
                    </td>

                    <td>
                      {order.status === "Compensated by Money" ||
                      order.status === "Compensated by Book" ? (
                        <>
                          <div
                            className="image-container"
                            onClick={() =>
                              handleImageClick(order.evidenceImagePath)
                            }
                          >
                            {previewURL ? (
                              <img
                                src={previewURL}
                                alt="Preview"
                                className="img-fluid mt-2"
                                style={{ maxWidth: "100px" }}
                              />
                            ) : order.evidenceImagePath ? (
                              <img
                                src={`http://localhost:9191/api/orders/evidence/${order.evidenceImagePath}`}
                                alt="Evidence"
                                className="img-fluid mt-2"
                                style={{
                                  maxWidth: "130px",
                                  borderRadius: "5px",
                                  transition:
                                    "transform 0.3s ease, border 0.3s ease",
                                  cursor: "pointer",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform =
                                    "scale(1.02)";
                                  e.currentTarget.style.border =
                                    "2px solid blue";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = "scale(1)";
                                  e.currentTarget.style.border = "none";
                                }}
                              />
                            ) : (
                              "N/A"
                            )}
                            <div className="overlay"></div>
                            <div className="overlay">
                              <span className="text">Xem rõ</span>
                            </div>
                          </div>
                          <input
                            type="file"
                            id={`fileInput-${order.orderDetailID}`}
                            style={{ display: "none" }}
                            onChange={(e) =>
                              handleFileChange(e, order.orderDetailID)
                            }
                          />

                          <label
                            htmlFor={`fileInput-${order.orderDetailID}`}
                            className="btn btn-outline-primary mt-2"
                            style={{ maxWidth: "50px" }}
                          >
                            <i
                              className="fa fa-upload"
                              style={{ marginRight: "5px" }}
                            ></i>
                            Chọn ảnh biên bản
                          </label>
                          {selectedFile &&
                            selectedFile.orderID === order.orderDetailID && (
                              <Button
                                className="btn btn-success mt-2"
                                onClick={() =>
                                  handleFileUpload(
                                    order.orderDetailID,
                                    order.status
                                  )
                                }
                              >
                                Upload
                              </Button>
                            )}
                        </>
                      ) : null}
                    </td>

                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          handleUpdateOrder(
                            order.orderDetailID,
                            order.status,
                            new Date(order.returnDate)
                          )
                        }
                        disabled={[
                          "Compensated by Money",
                          "Compensated by Book",
                          "Overdue",
                          "Pending",
                          "Cancelled",
                        ].includes(order.status)}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center">
            <img
              src={empty_state}
              alt="No Orders Found"
              className="img-fluid"
            />
            <p>Không có đơn hàng nào !</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Xử lý mất sách"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            minWidth: "800px",
            height: "30%",
            minHeight: "400px",
          },
        }}
      >
        <h2>Xử lý mất sách</h2>
        <div className="d-flex justify-content-center">
          <button
            className="btn btn-primary m-2"
            onClick={() =>
              handleCompensateOrder(selectedOrder.orderDetailID, "money")
            }
          >
            Phương án đền tiền
          </button>
          <button
            className="btn btn-secondary m-2"
            onClick={() =>
              handleCompensateOrder(selectedOrder.orderDetailID, "book")
            }
          >
            Phương án đền sách
          </button>
        </div>
        <div className="d-flex justify-content-center">
          <button className="btn btn-danger mt-3" onClick={closeModal}>
            Đóng
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={imageModalOpen}
        onRequestClose={closeImageModal}
        contentLabel="Xem ảnh"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "60%",
            height: "auto",
          },
        }}
      >
        <img
          src={`http://localhost:9191/api/orders/evidence/${currentImage}`}
          alt="Full view"
          style={{ width: "100%", height: "100%" }}
        />
        <button onClick={closeImageModal} className="btn btn-danger mt-2">
          Đóng
        </button>
      </Modal>

      <Modal
        isOpen={webcamOpen}
        onRequestClose={() => setWebcamOpen(false)}
        contentLabel="Chụp ảnh bằng webcam"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            minWidth: "800px",
            height: "30%",
            minHeight: "400px",
          },
        }}
      >
        <h2>Chụp ảnh bằng webcam</h2>
        <Webcam
          audio={false}
          screenshotFormat="image/jpeg"
          width="100%"
          ref={webcamRef}
          style={{ marginBottom: "20px" }}
        />
        <div className="d-flex justify-content-center">
          <button className="btn btn-primary m-2" onClick={handleCapture}>
            Chụp ảnh
          </button>
          <button
            className="btn btn-secondary m-2"
            onClick={() => setWebcamOpen(false)}
          >
            Đóng
          </button>
        </div>
      </Modal>
    </>
  );
}

export default StaffOrderManagement;
