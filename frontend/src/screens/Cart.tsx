import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { cartItem } from "../types/cartItem";

function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();

  // Calculate the total price of all items in the cart
  const totalPrice = cart.reduce((total, item) => total + item.totalPrice, 0);

  return (
    <>
      <Header />
      <div className="header-spacer"></div>

      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <h1>Shopping Cart</h1>
            <div className="mb-3">
              {cart.length >= 1 ? (
                <span>Number of Items: {cart.length}</span>
              ) : (
                <>
                  <span>Your cart is empty!</span>
                  <div className="mt-3">
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate("/")}
                    >
                      Return to Shop
                    </button>
                  </div>
                </>
              )}
            </div>

            {cart.length > 0 && (
              <>
                <ul className="list-group mb-3">
                  {cart.map((item: cartItem) => (
                    <li
                      key={item.bookId}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <h5>{item.bookTitle}</h5>
                        <p>
                          ${item.bookPrice} x {item.quantity}
                        </p>
                      </div>
                      <span className="badge bg-primary rounded-pill">
                        ${item.totalPrice.toFixed(2)}
                      </span>
                      <button onClick={() => {removeFromCart(item)}}>x</button>
                    </li>
                  ))}
                </ul>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3>Total: ${totalPrice.toFixed(2)}</h3>
                  <div>
                    <button className="btn btn-success me-2">Checkout</button>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate("/")}
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Cart;
