import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const PRODUCTS_PER_PAGE = 8;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/category");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);

      let url = "http://localhost:5000/api/products";
      const queryParams = [];

      if (selectedCategory) {
        queryParams.push(`category=${selectedCategory}`);
      }

      if (queryParams.length > 0) {
        url += `?${queryParams.join("&")}`;
      }

      const response = await axios.get(url);
      let fetchedProducts = response.data;

      if (search.trim()) {
        fetchedProducts = fetchedProducts.filter((product) =>
          product.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      setProducts(fetchedProducts);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return products.slice(start, start + PRODUCTS_PER_PAGE);
  }, [products, currentPage]);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  return (
    <div className="container py-4 py-lg-5">
      <section className="hero-section mb-5">
        <span className="hero-badge">New Season · Modern Style</span>
        <h1 className="hero-title">Elevate your wardrobe with WearHouse.</h1>
        <p className="hero-text">
          Discover stylish essentials, statement pieces, and everyday fashion
          curated for a clean modern look.
        </p>
      </section>

      <section className="filter-card mb-4">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-3">
          <div>
            <h2 className="section-title mb-1">Shop Collection</h2>
            <p className="section-subtitle mb-0">
              Browse products, filter by category, and find your perfect fit.
            </p>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-md-5">
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3 d-grid">
            <button className="btn btn-dark" onClick={fetchProducts}>
              Search
            </button>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-dark"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <h5 className="mb-2">No products found</h5>
          <p className="mb-0">Try another search or category.</p>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {paginatedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                      Previous
                    </button>
                  </li>

                  {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                    (page) => (
                      <li
                        key={page}
                        className={`page-item ${currentPage === page ? "active" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      </li>
                    )
                  )}

                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const ProductCard = ({ product }) => {
  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = existingCart.find((item) => item._id === product._id);

    let updatedCart;

    if (existingItem) {
      updatedCart = existingCart.map((item) =>
        item._id === product._id
          ? {
              ...item,
              quantity: Math.min(item.quantity + 1, product.stock),
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
          quantity: 1,
        },
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert("Added to cart");
  };

  return (
    <div className="col-sm-6 col-lg-4 col-xl-3">
      <div className="card product-card h-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/500x650?text=WearHouse";
          }}
        />

        <div className="card-body d-flex flex-column p-4">
          <div className="mb-2">
            <span className="category-pill">
              {product.category?.title || "Fashion"}
            </span>
          </div>

          <h5 className="card-title text-capitalize mb-2">
            {product.name.length > 28
              ? product.name.slice(0, 28) + "..."
              : product.name}
          </h5>

          <p className="price-text mb-3">${product.price}</p>

          <span
            className={`stock-badge mb-3 ${
              product.stock > 0 ? "stock-in" : "stock-out"
            }`}
          >
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>

          <div className="d-grid gap-2 mt-auto">
            <Link
              to={`/products/${product._id}`}
              className="btn btn-outline-dark w-100"
            >
              View Details
            </Link>

            <button
              className="btn btn-dark w-100"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;