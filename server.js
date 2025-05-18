require("dotenv").config();
const express = require("express");

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const cors = require("cors");
const stripe = require("stripe")(stripeSecret);

const app = express();
app.use(
  cors({
    origin: "https://starlit-sprinkles-eab210.netlify.app",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
// recommended by stripe
app.use(express.static("public"));
app.use(express.json());

app.post("/checkout", async (req, res) => {
  console.log(req.body);
  const items = req.body.items;
  let lineItems = [];
  items.forEach((item) => {
    lineItems.push({ price: item.id, quantity: item.quantity });
  });
  console.log(lineItems);
  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: "https://shoppingcartserver-production.up.railway.app/success",
    cancel_url: "https://shoppingcartserver-production.up.railway.app/cancel",
  });

  res.send(
    JSON.stringify({
      url: session.url,
    })
  );
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
