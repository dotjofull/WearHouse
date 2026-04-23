const Footer = () => {
  return (
    <footer className="py-4 border-top">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        <div className="text-center text-md-start">
          <h6 className="fw-bold mb-1">WearHouse</h6>
          <p className="text-muted mb-0 small">
            Modern fashion e-commerce experience.
          </p>
        </div>

        <p className="text-muted small mb-0 text-center text-md-end">
          © 2026 WearHouse. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;