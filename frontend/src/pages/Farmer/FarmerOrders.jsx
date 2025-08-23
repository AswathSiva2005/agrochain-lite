import { useEffect, useState } from 'react';
import axios from 'axios';

function FarmerOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    const token = localStorage.getItem('agrochain-token');
    axios.get('https://agrochain-lite.onrender.com/api/orders/farmer', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    const token = localStorage.getItem('agrochain-token');
    try {
      await axios.put(
        `https://agrochain-lite.onrender.com/api/orders/status/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      alert('Error updating order status');
    }
  };

  return (
    <div className="container mt-4">
      <h3>Orders Received</h3>
      {orders.length === 0 ? (
        <div className="alert alert-info">No orders received.</div>
      ) : (
        <div className="row">
          {orders.map(order => (
            <div className="col-md-4 mb-4" key={order._id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{order.cropId?.cropName}</h5>
                  <p className="card-text">
                    Quantity: {order.quantity} kg<br />
                    Total Price: ₹{order.totalPrice}<br />
                    Status: {order.status}<br />
                    Buyer: {order.buyerId?.name}
                  </p>
                  {order.status === 'pending' && (
                    <>
                      <button
                        className="btn btn-success me-2"
                        onClick={() => handleStatusChange(order._id, 'accepted')}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleStatusChange(order._id, 'rejected')}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FarmerOrders;
