import React, { useState } from 'react';

interface PaymentProps {
  parkingSpot: {
    id: number;
    name: string;
    address: string;
    price: string;
    available: number;
    total: number;
    type: string;
  };
  onPaymentComplete: (reservationId: string) => void;
  onCancel: () => void;
}

const Payment: React.FC<PaymentProps> = ({ parkingSpot, onPaymentComplete, onCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'apple'>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [duration, setDuration] = useState(2); // hours
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');

  // Calculate total price based on duration
  const getPricePerHour = (priceString: string): number => {
    const match = priceString.match(/(\d+(?:\.\d+)?)\s*PLN\/h/);
    return match ? parseFloat(match[1]) : 3; // Default to 3 PLN/h
  };

  const pricePerHour = getPricePerHour(parkingSpot.price);
  const totalPrice = pricePerHour * duration;
  const reservationFee = 2; // PLN
  const finalTotal = totalPrice + reservationFee;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const reservationId = `RSV-${Date.now()}-${parkingSpot.id}`;
    
    setIsProcessing(false);
    setStep('confirmation');
    
    // In real app, this would integrate with payment gateway
    setTimeout(() => {
      onPaymentComplete(reservationId);
    }, 3000);
  };

  const handleCardInput = (field: keyof typeof cardDetails, value: string) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (step === 'confirmation') {
    return (
      <div className="payment-container">
        <div className="payment-success">
          <div className="success-icon">✅</div>
          <h2>Payment Successful!</h2>
          <p>Your parking spot has been reserved.</p>
          <div className="reservation-details">
            <h3>Reservation Details</h3>
            <p><strong>Location:</strong> {parkingSpot.name}</p>
            <p><strong>Duration:</strong> {duration} hours</p>
            <p><strong>Total Paid:</strong> {finalTotal.toFixed(2)} PLN</p>
            <p><strong>Reservation ID:</strong> {`RSV-${Date.now()}-${parkingSpot.id}`}</p>
          </div>
          <button 
            className="payment-button primary"
            onClick={() => onPaymentComplete(`RSV-${Date.now()}-${parkingSpot.id}`)}
          >
            View Reservation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h2>Reserve Parking Spot</h2>
        <button className="close-button" onClick={onCancel}>✕</button>
      </div>

      <div className="spot-summary">
        <h3>{parkingSpot.name}</h3>
        <p>{parkingSpot.address}</p>
        <div className="spot-meta">
          <span className="spot-type">{parkingSpot.type}</span>
          <span className="availability">{parkingSpot.available} spots available</span>
        </div>
      </div>

      {step === 'details' ? (
        <div className="payment-step">
          <h3>Select Duration</h3>
          <div className="duration-selector">
            {[1, 2, 4, 8, 12, 24].map(hours => (
              <button
                key={hours}
                className={`duration-option ${duration === hours ? 'selected' : ''}`}
                onClick={() => setDuration(hours)}
              >
                {hours}h
              </button>
            ))}
          </div>

          <div className="price-breakdown">
            <h4>Price Breakdown</h4>
            <div className="price-row">
              <span>Parking ({duration}h × {pricePerHour} PLN/h)</span>
              <span>{(pricePerHour * duration).toFixed(2)} PLN</span>
            </div>
            <div className="price-row">
              <span>Reservation Fee</span>
              <span>{reservationFee.toFixed(2)} PLN</span>
            </div>
            <div className="price-row total">
              <span>Total</span>
              <span>{finalTotal.toFixed(2)} PLN</span>
            </div>
          </div>

          <button 
            className="payment-button primary"
            onClick={() => setStep('payment')}
            disabled={parkingSpot.available === 0}
          >
            Continue to Payment
          </button>
        </div>
      ) : (
        <div className="payment-step">
          <h3>Payment Method</h3>
          
          <div className="payment-methods">
            <button
              className={`payment-method ${paymentMethod === 'card' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              💳 Credit/Debit Card
            </button>
            <button
              className={`payment-method ${paymentMethod === 'paypal' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('paypal')}
            >
              🅿️ PayPal
            </button>
            <button
              className={`payment-method ${paymentMethod === 'apple' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('apple')}
            >
              🍎 Apple Pay
            </button>
          </div>

          {paymentMethod === 'card' && (
            <div className="card-form">
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.number}
                  onChange={(e) => handleCardInput('number', formatCardNumber(e.target.value))}
                  maxLength={19}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => handleCardInput('expiry', formatExpiry(e.target.value))}
                    maxLength={5}
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => handleCardInput('cvv', e.target.value.replace(/\D/g, ''))}
                    maxLength={4}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={cardDetails.name}
                  onChange={(e) => handleCardInput('name', e.target.value)}
                />
              </div>
            </div>
          )}

          {paymentMethod === 'paypal' && (
            <div className="paypal-info">
              <p>You will be redirected to PayPal to complete your payment.</p>
              <p>Total amount: <strong>{finalTotal.toFixed(2)} PLN</strong></p>
            </div>
          )}

          {paymentMethod === 'apple' && (
            <div className="apple-pay-info">
              <p>Use Apple Pay for quick and secure payment.</p>
              <p>Total amount: <strong>{finalTotal.toFixed(2)} PLN</strong></p>
            </div>
          )}

          <div className="payment-actions">
            <button 
              className="payment-button secondary"
              onClick={() => setStep('details')}
            >
              Back
            </button>
            <button 
              className="payment-button primary"
              onClick={handlePayment}
              disabled={isProcessing || (paymentMethod === 'card' && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name))}
            >
              {isProcessing ? 'Processing...' : `Pay ${finalTotal.toFixed(2)} PLN`}
            </button>
          </div>
        </div>
      )}

      <div className="payment-footer">
        <p>🔒 Your payment is secure and encrypted</p>
        <p>📱 You'll receive a confirmation email and SMS</p>
      </div>
    </div>
  );
};

export default Payment;
