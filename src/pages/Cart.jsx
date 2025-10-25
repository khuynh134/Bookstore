import './Cart.css';
import "@fortawesome/fontawesome-free"
import React, {useState} from "react";
function Cart() {

 const [quantity,setQuantity]= useState(1); // this starts with one
 const price = 27;
 const subtotal = price * quantity;
 
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
              <td>$10</td>
              <td><input type="number" value="1"/></td>
              <td>$10</td>
            </tr>
            <tr>
              <td><i className="far fa-times-circle"></i></td>
              <td><img src="https://brightspotcdn.byu.edu/dims4/default/918b6a9/2147483647/strip/true/crop/676x1024+0+0/resize/676x1024!/quality/90/?url=https%3A%2F%2Fbrigham-young-brightspot-us-east-2.s3.us-east-2.amazonaws.com%2F71%2Fa1%2F2bdf70bc302875f943d214dfac52%2Fhp4cover-676x1024.jpg" alt=""/></td>
              <td>Harry Potter And The Goblet of Fire</td>
              <td>${price}</td>
              <td><input type="number" 
              value={quantity}
              min="1"
              onChange={(e)=> setQuantity(Number(e.target.value))}
              />
              </td>
              <td>${subtotal}</td>
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
                    <td>$37</td>
                </tr>
                <tr>
                    <td>Shipping</td>
                    <td>Free</td>
                </tr>
                <tr>
                    <td><strong>Total</strong></td>
                    <td><strong>$37</strong></td>
                </tr>
            </table>
            <button className="buttn">Proceed to Checkout</button>
        </div>

      </section>
    </div>
  );
}

export default Cart;
