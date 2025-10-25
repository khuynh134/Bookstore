import './Cart.css';
import "@fortawesome/fontawesome-free"

function Cart() {
  return (
    <div>
      <h1>Your Cart</h1>

      <section id="cart" className="section-p1">
        <table width="100%">
          <thead>
            <tr>
              <td>Remove</td>
              <td>Image</td>
              <td>Product</td>
              <td>Price</td>
              <td>Quantity</td>
              <td>Subtotal</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><i className="far fa-times-circle"></i></td>
              <td><img src="https://i.thriftbooks.com/api/imagehandler/m/19D6645B3BA7620CA71E487187EF147B6EA851A7.jpeg" alt=""/></td>
              <td>When You are Engulfed in Flames</td>
              <td>$200</td>
              <td><input type="number" value="1"/></td>
              <td>$200</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section id="cart-add" className="section-p2">
        <div id="subtotal">
            <h1>Cart Total</h1>
            <table>
                <tr>
                    <td>Cart Subtotal:</td>
                    <td>$200</td>
                </tr>
                <tr>
                    <td>Shipping</td>
                    <td>Free</td>
                </tr>
                <tr>
                    <td><strong>Total</strong></td>
                    <td><strong>$200</strong></td>
                </tr>
            </table>
            <button className="buttn">Proceed to Checkout</button>
        </div>

      </section>
    </div>
  );
}

export default Cart;
