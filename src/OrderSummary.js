import React from 'react';

function OrderSummary({ order }) {
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
              {item.name} x {item.quantity} - ${item.price.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
      <h4>Total: ${totalPrice.toFixed(2)}</h4>
      <button>Place Order</button>
    </div>
  );
}

export default OrderSummary;
