import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);

  const [editingProductId, setEditingProductId] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const [productForm, setProductForm] = useState({
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  image: null,
});

  const [categoryForm, setCategoryForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/orders",
        authHeaders
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/category");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchCategories();
  }, []);

  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      image: null,
    });
    setEditingProductId(null);
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      title: "",
      description: "",
      imageUrl: "",
    });
    setEditingCategoryId(null);
  };

  const handleProductChange = (e) => {
  const { name, value, files } = e.target;

  if (name === "image") {
    setProductForm((prev) => ({
      ...prev,
      image: files[0],
    }));
  } else {
    setProductForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};

  const handleCategoryChange = (e) => {
    setCategoryForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProductSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();
    formData.append("name", productForm.name);
    formData.append("description", productForm.description);
    formData.append("price", productForm.price);
    formData.append("category", productForm.category);
    formData.append("stock", productForm.stock);

    if (productForm.image) {
      formData.append("image", productForm.image);
    }

    if (editingProductId) {
      await axios.put(
        `http://localhost:5000/api/products/${editingProductId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } else {
      await axios.post("http://localhost:5000/api/products", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    setProductForm({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      image: null,
    });

    setEditingProductId(null);
    fetchProducts();
  } catch (error) {
    console.error("Failed to save product:", error);
    alert(error.response?.data?.message || "Failed to save product");
  }
};

  const handleEditProduct = (product) => {
  setEditingProductId(product._id);
  setProductForm({
    name: product.name || "",
    description: product.description || "",
    price: product.price || "",
    category: product.category?._id || product.category || "",
    stock: product.stock || "",
    image: null,
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
};

  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/products/${productId}`,
        authHeaders
      );
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCategoryId) {
        await axios.put(
          `http://localhost:5000/api/category/${editingCategoryId}`,
          categoryForm,
          authHeaders
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/category",
          categoryForm,
          authHeaders
        );
      }

      resetCategoryForm();
      fetchCategories();
    } catch (error) {
      console.error("Failed to save category:", error);
      alert(error.response?.data?.message || "Failed to save category");
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategoryId(category._id);
    setCategoryForm({
      title: category.title || "",
      description: category.description || "",
      imageUrl: category.imageUrl || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteCategory = async (categoryId) => {
    const confirmed = window.confirm("Delete this category?");
    if (!confirmed) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/category/${categoryId}`,
        authHeaders
      );
      fetchCategories();
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert(error.response?.data?.message || "Failed to delete category");
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status },
        authHeaders
      );
      fetchOrders();
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  return (
    <div className="container py-5">
      <div className="mb-4 mb-lg-5">
        <h1 className="fw-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted mb-0">
          Manage products, categories, and customer orders.
        </p>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card dashboard-stat h-100">
            <div className="card-body text-center py-4">
              <p className="text-muted mb-2">Products</p>
              <h2 className="fw-bold mb-0">{products.length}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card dashboard-stat h-100">
            <div className="card-body text-center py-4">
              <p className="text-muted mb-2">Orders</p>
              <h2 className="fw-bold mb-0">{orders.length}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card dashboard-stat h-100">
            <div className="card-body text-center py-4">
              <p className="text-muted mb-2">Categories</p>
              <h2 className="fw-bold mb-0">{categories.length}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="panel-card p-4 mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h3 className="fw-bold mb-0">
            {editingProductId ? "Edit Product" : "Add New Product"}
          </h3>
          {editingProductId && (
            <button className="btn btn-outline-secondary" onClick={resetProductForm}>
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleProductSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Product name"
                value={productForm.name}
                onChange={handleProductChange}
              />
            </div>

            <div className="col-md-6">
              <input
                type="number"
                name="price"
                className="form-control"
                placeholder="Price"
                value={productForm.price}
                onChange={handleProductChange}
              />
            </div>

            <div className="col-12">
              <textarea
                name="description"
                className="form-control"
                rows="3"
                placeholder="Description"
                value={productForm.description}
                onChange={handleProductChange}
              />
            </div>

            <div className="col-md-4">
              <select
                name="category"
                className="form-select"
                value={productForm.category}
                onChange={handleProductChange}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <input
                type="number"
                name="stock"
                className="form-control"
                placeholder="Stock"
                value={productForm.stock}
                onChange={handleProductChange}
              />
            </div>

            <div className="col-md-4">
  <input
    type="file"
    name="image"
    className="form-control"
    accept="image/*"
    onChange={handleProductChange}
  />
</div>

            <div className="col-12">
              <button type="submit" className="btn btn-dark">
                {editingProductId ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="panel-card p-4 mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h3 className="fw-bold mb-0">
            {editingCategoryId ? "Edit Category" : "Manage Categories"}
          </h3>
          {editingCategoryId && (
            <button className="btn btn-outline-secondary" onClick={resetCategoryForm}>
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleCategorySubmit} className="mb-4">
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="Category title"
                value={categoryForm.title}
                onChange={handleCategoryChange}
              />
            </div>

            <div className="col-md-4">
              <input
                type="text"
                name="imageUrl"
                className="form-control"
                placeholder="Image URL"
                value={categoryForm.imageUrl}
                onChange={handleCategoryChange}
              />
            </div>

            <div className="col-md-4">
              <button type="submit" className="btn btn-dark w-100">
                {editingCategoryId ? "Update Category" : "Add Category"}
              </button>
            </div>

            <div className="col-12">
              <textarea
                name="description"
                className="form-control"
                rows="2"
                placeholder="Category description"
                value={categoryForm.description}
                onChange={handleCategoryChange}
              />
            </div>
          </div>
        </form>

        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center text-muted py-4">
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category._id}>
                    <td>{category.title}</td>
                    <td>{category.description}</td>
                    <td className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-dark"
                        onClick={() => handleEditCategory(category)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteCategory(category._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="table-wrapper mb-5">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <h3 className="fw-bold mb-0">All Products</h3>
          <span className="text-muted small">Manage inventory</span>
        </div>

        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Category</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          style={{ width: "65px", height: "75px", objectFit: "cover" }}
                          className="rounded"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/250x300?text=WearHouse";
                          }}
                        />
                        <div className="fw-semibold text-capitalize">
                          {product.name}
                        </div>
                      </div>
                    </td>
                    <td>${product.price}</td>
                    <td>{product.category?.title}</td>
                    <td>{product.stock}</td>
                    <td className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-dark"
                        onClick={() => handleEditProduct(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="table-wrapper">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <h3 className="fw-bold mb-0">All Orders</h3>
          <span className="text-muted small">Track customer activity</span>
        </div>

        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-6)}</td>
                    <td>{order.user?.name}</td>
                    <td>${order.totalPrice.toFixed(2)}</td>
                    <td>
                      <span className="badge bg-secondary px-3 py-2">
                        {order.status}
                      </span>
                    </td>
                    <td style={{ minWidth: "180px" }}>
                      <select
                        className="form-select"
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                      >
                        <option value="pending">pending</option>
                        <option value="shipped">shipped</option>
                        <option value="delivered">delivered</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;