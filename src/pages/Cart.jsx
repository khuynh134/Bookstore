import './Cart.css';

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
              <td>Quantity</td>
              <td>Subtotal</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><i className="far fa-times-circle"></i></td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Cart;
