require("dotenv").config();
const express = require("express");

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const cors = require("cors");
const stripe = require("stripe")(stripeSecret);

const app = express();
app.use(cors());
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
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });

  res.send(
    JSON.stringify({
      url: session.url,
    })
  );
});
app.listen(4000, () => {
  console.log("listening on port 4000");
});
