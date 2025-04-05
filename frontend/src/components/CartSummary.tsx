import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../css/cartSummary.css";

function CartSummary() {
  const navigate = useNavigate();
  const { cart } = useCart();

  const totalPrice = cart.reduce((total, item) => total + item.totalPrice, 0);
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <div className="cart-summary" onClick={() => navigate("/cart")}>
      <span className="cart-icon">🛒</span>
      <strong>${totalPrice.toFixed(2)}</strong>
      {itemCount > 0 && <div className="items-count">{itemCount}</div>}
    </div>
  );
}

export default CartSummary;
