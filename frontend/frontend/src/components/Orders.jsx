import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Orders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning text-dark";
      case "shipped":
        return "bg-primary";
      case "delivered":
        return "bg-success";
      case "cancelled":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark"></div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h1 className="fw-bold mb-1">My Orders</h1>
        <p className="text-muted mb-0">
          Track your purchases and check the latest order status.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <h5 className="mb-2">No orders found</h5>
          <p className="mb-0">You haven’t placed any orders yet.</p>
        </div>
      ) : (
        <div className="d-grid gap-4">
          {orders.map((order) => (
            <div key={order._id} className="card order-card">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
                  <div>
                    <h5 className="fw-bold mb-2">Order #{order._id.slice(-6)}</h5>
                    <p className="mb-1 text-muted">
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="mb-0 fw-semibold">
                      Total: ${order.totalPrice.toFixed(2)}
                    </p>
                  </div>

                  <span className={`badge ${getStatusClass(order.status)} px-3 py-2`}>
                    {order.status}
                  </span>
                </div>

                <div className="row g-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="col-md-6">
                      <div className="border rounded-4 p-3 d-flex gap-3 align-items-center h-100">
                        <img
                          src={
                            item.imageUrl ||
                            "https://via.placeholder.com/250x300?text=WearHouse"
                          }
                          alt={item.name}
                          className="rounded"
                          style={{
                            width: "80px",
                            height: "90px",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/250x300?text=WearHouse";
                          }}
                        />

                        <div>
                          <h6 className="mb-1 text-capitalize">{item.name}</h6>
                          <p className="mb-1 text-muted">
                            Quantity: {item.quantity}
                          </p>
                          <p className="mb-0 fw-semibold">${item.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;