import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const handleProductSelection = (product) => {
    setProductShowing(product);
    setShowModal(true);
    console.log(showModal, products, productShowing);
  };

  const updateNewProductForm = (event) => {
    setNewProduct({
      ...newProduct,
      items: [
        {
          ...newProduct.items[0],
          [event.target.name]: event.target.value,
        },
      ],
    });
  };
  const addProductInMemory = () => {
    console.log(newProduct);
    setProducts([
      ...products,
      {
        ...newProduct,
        totals: {
          total: (
            Number(newProduct.items[0].price) *
            Number(newProduct.items[0].quantity) *
            1.36
          )
            .toFixed(2)
            .toString(),
        },
      },
    ]);

    setNewProduct({
      id: new Date().getTime(),
      name: `#${new Date().getTime().toString().slice(-5, -1)}`,
      currency: "MXN",
      totals: {
        total: "",
      },
      status: {
        financial: "paid",
      },
      items: [{ sku: "", name: "", quantity: 1, price: "" }],
    });
    console.log(newProduct);
  };

  const hideModal = () => {
    setShowModal(false);
  };
  const [newProduct, setNewProduct] = useState({
    id: new Date().getTime(),
    name: `#${new Date().getTime().toString().slice(-5, -1)}`,
    currency: "MXN",
    totals: {
      total: "",
    },
    status: {
      financial: "paid",
    },
    items: [{ sku: "", name: "", quantity: 1, price: "" }],
  });

  const [products, setProducts] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [productShowing, setProductShowing] = useState(false);

  useEffect(() => {
    fetch("https://eshop-deve.herokuapp.com/api/v2/orders", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer `,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setProducts(res.orders);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container">
      {/* NEW PRODUCT */}
      <div className="card mb-3 mt-3">
        <div className="card-body">
          <h4 className="mb-2">
            <b>{newProduct.name}</b>
          </h4>
          <h5 className="mb-4">
            <b>Crea un producto</b>
          </h5>

          <div className="row">
            <div className="col-lg-6 mb-2">
              <label>SKU</label>
              <input
                value={newProduct.items[0]["sku"]}
                onChange={(e) => updateNewProductForm(e)}
                name="sku"
                type="text"
                className="form-control"
              />
            </div>
            <div className="col-lg-6 mb-2">
              <label>Name</label>
              <input
                value={newProduct.items[0].name}
                onChange={(e) => updateNewProductForm(e)}
                name="name"
                type="text"
                className="form-control"
              />
            </div>
            <div className="col-lg-6 mb-2">
              <label>Quantity</label>
              <input
                value={newProduct.items[0].quantity}
                onChange={(e) => updateNewProductForm(e)}
                name="quantity"
                type="number"
                className="form-control"
              />
            </div>
            <div className="col-lg-6 mb-2">
              <label>Price</label>
              <input
                value={newProduct.items[0].price}
                onChange={(e) => updateNewProductForm(e)}
                name="price"
                type="number"
                className="form-control"
              />
            </div>
          </div>
          <div className="col col-lg-12 mb-2 d-grid">
            <button
              className="btn btn-primary"
              onClick={() => addProductInMemory()}
            >
              AGREGAR
            </button>
          </div>
        </div>
      </div>
      {/* ORDERS LIST */}
      <div className="card">
        <div className="card-body">
          <h5 className="mb-4">
            <b>Ordenes </b>
            (haz click sobre la orden para ver los detalles)
          </h5>
          <div className="table-responsive">
            <table className="table">
              <thead className="text-center">
                <tr>
                  <th>ID</th>
                  <th>Number</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody className="table-striped">
                {products.length > 0
                  ? products.map((product) => (
                      <tr
                        key={product.id}
                        className="p-3"
                        style={{
                          cursor: "pointer",
                        }}
                        data-toggle="modal"
                        data-target="#exampleModal"
                        onClick={() => handleProductSelection(product)}
                      >
                        <td className="text-center">{product.id}</td>

                        <td className="text-center">{product.name}</td>
                        <td className="text-center">
                          {product.status.financial}
                        </td>
                        <td className="text-center">
                          {`${product.totals.total} ${product.currency}`}
                        </td>
                      </tr>
                    ))
                  : ""}
                {showModal ? (
                  <div
                    style={{
                      position: "fixed",
                      zIndex: 1,
                      left: 0,
                      top: 0,
                      width: "100%",
                      height: "100%",
                      overflow: "auto",
                      backgroundColor: "rgba(0,0,0,0.4)",
                    }}
                    onClick={() => hideModal()}
                  >
                    <div
                      className="modal-dialog"
                      style={{
                        backgroundColor: " #fefefe",
                        margin: "15% auto" /* 15% from the top and centered */,
                        padding: "20px",
                        border: "1px solid #888",
                        width:
                          "80%" /* Could be more or less, depending on screen size */,
                      }}
                    >
                      <div className="modal-body">
                        <div className="table-responsive">
                          {productShowing.items.length > 0 ? (
                            <table className="table">
                              <thead>
                                <tr>
                                  <th>SKU</th>
                                  <th>Name</th>
                                  <th>Quantity</th>
                                  <th>Price</th>
                                </tr>
                              </thead>
                              <tbody>
                                {productShowing.items.map((i, index) => (
                                  <tr key={i.id + index}>
                                    <td>{i.sku}</td>
                                    <td>{i.name}</td>
                                    <td>{i.quantity}</td>
                                    <td>{i.price}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            "La orden no tiene productos"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
