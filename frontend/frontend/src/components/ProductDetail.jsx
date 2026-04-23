import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = existingCart.find((item) => item._id === product._id);

    let updatedCart;

    if (existingItem) {
      updatedCart = existingCart.map((item) =>
        item._id === product._id
          ? {
              ...item,
              quantity: Math.min(item.quantity + quantity, product.stock),
            }
          : item
      );
    } else {
      updatedCart = [
        ...existingCart,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          stock: product.stock,
          quantity,
        },
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5">
        <div className="empty-state">
          <h5 className="mb-2">Product not found</h5>
          <p className="mb-0">This product may have been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row g-4 align-items-start">
        <div className="col-lg-6">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="img-fluid detail-image"
            style={{ width: "100%", maxHeight: "650px", objectFit: "cover" }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/700x850?text=WearHouse";
            }}
          />
        </div>

        <div className="col-lg-6">
          <div className="detail-panel">
            <div className="mb-3">
              <span className="category-pill">
                {product.category?.title || "Fashion"}
              </span>
            </div>

            <h1 className="fw-bold text-capitalize mb-3">{product.name}</h1>

            <p className="price-text mb-3">${product.price}</p>

            <p className="text-muted mb-4">{product.description}</p>

            <div className="d-flex flex-wrap gap-2 mb-4">
              <span
                className={`stock-badge ${
                  product.stock > 0 ? "stock-in" : "stock-out"
                }`}
              >
                {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
              </span>
            </div>

            {product.stock > 0 && (
              <>
                <div className="mb-4" style={{ maxWidth: "150px" }}>
                  <label className="form-label fw-semibold">Quantity</label>
                  <select
                    className="form-select"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  >
                    {Array.from({ length: product.stock }, (_, index) => index + 1).map(
                      (num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <button className="btn btn-dark px-4" onClick={handleAddToCart}>
                  Add to Cart
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;