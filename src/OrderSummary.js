import React from 'react';

function OrderSummary({ order, onPlaceOrder }) {
  const totalPrice = order.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="order-summary-container">
      <h3>Your Order</h3>
      {order.length === 0 ? (
        <p>No items in your order</p>
      ) : (
        <ul>
          {order.map((item) => (
            <li key={item.id}>
              {item.name} x {item.quantity} - ₩{item.price.toLocaleString()}
            </li>
          ))}
        </ul>
      )}
      <h4>Total: ₩{totalPrice.toLocaleString()}</h4>
      <button onClick={onPlaceOrder}>Place Order</button>
    </div>
  );
}

export default OrderSummary;
