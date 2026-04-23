import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Cart = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  const updateCart = (updatedItems) => {
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const updatedItems = cartItems.map((item) =>
      item._id === productId ? { ...item, quantity: Number(newQuantity) } : item
    );

    updateCart(updatedItems);
  };

  const handleRemoveItem = (productId) => {
    const updatedItems = cartItems.filter((item) => item._id !== productId);
    updateCart(updatedItems);
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    try {
      const orderItems = cartItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      }));

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        { items: orderItems },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("cart");
      setCartItems([]);
      navigate("/orders");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h1 className="fw-bold mb-1">My Cart</h1>
          <p className="text-muted mb-0">
            Review your selected items before placing the order.
          </p>
        </div>

        <Link to="/" className="btn btn-outline-dark">
          Continue Shopping
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-state">
          <h5 className="mb-2">Your cart is empty</h5>
          <p className="mb-3">Looks like you haven’t added anything yet.</p>
          <Link to="/" className="btn btn-dark">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="table-wrapper">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item._id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="rounded"
                              style={{
                                width: "85px",
                                height: "95px",
                                objectFit: "cover",
                              }}
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/250x300?text=WearHouse";
                              }}
                            />

                            <div>
                              <h6 className="mb-1 text-capitalize">{item.name}</h6>
                              <small className="text-muted">
                                Stock available: {item.stock}
                              </small>
                            </div>
                          </div>
                        </td>

                        <td className="fw-semibold">${item.price}</td>

                        <td style={{ minWidth: "110px" }}>
                          <select
                            className="form-select"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(item._id, e.target.value)
                            }
                          >
                            {Array.from(
                              { length: item.stock },
                              (_, index) => index + 1
                            ).map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="fw-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>

                        <td>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleRemoveItem(item._id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="panel-card p-4">
              <h4 className="fw-bold mb-3">Order Summary</h4>

              <div className="d-flex justify-content-between mb-2">
                <span>Items</span>
                <span>{cartItems.length}</span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>Total</span>
                <span className="fw-bold fs-5">${totalPrice.toFixed(2)}</span>
              </div>

              <hr />

              <button className="btn btn-dark w-100 mt-2" onClick={handlePlaceOrder}>
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;