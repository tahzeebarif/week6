require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("./config/passportConfig");


const app = express();
app.use(cors());

// Stripe Webhook needs the raw body to verify signature
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('./models/Order');
const User = require('./models/User');

app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (endpointSecret && sig) {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      // Fallback for local testing without signature if secret is missing
      event = JSON.parse(req.body);
    }
  } catch (err) {
    console.error(`Webhook verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payments
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;
    const userId = paymentIntent.metadata.userId;

    if (orderId) {
      try {
        const order = await Order.findById(orderId);
        if (order) {
           order.isPaid = true;
           order.paidAt = Date.now();
           order.paymentStatus = 'Success';
           order.transactionId = paymentIntent.id;
           await order.save();

           // Add loyalty points logic if user exists
           if (userId) {
              const user = await User.findById(userId);
              if (user) {
                 user.loyaltyPoints += Math.floor(paymentIntent.amount / 100);
                 await user.save();
              }
           }
        }
      } catch (err) {
        console.error("Error updating order post-payment", err);
      }
    }
  } else if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;
    if (orderId) {
      try {
         const order = await Order.findById(orderId);
         if (order && order.paymentStatus !== 'Success') {
           order.paymentStatus = 'Failed';
           await order.save();
         }
      } catch (err) {}
    }
  }

  res.status(200).json({ received: true });
});

app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));