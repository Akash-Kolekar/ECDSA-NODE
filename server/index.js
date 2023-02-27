const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "041d6f015b459224af8588228e2e36caab691c602b2582c40a58dc035614cd44167279660d7e85284a3e8c75a2ab76ffafde0752787696f938bb424dd8a64a5dd0": 100,
  "04892e7119db48b15c3bc5c3a327e878b0607da5cd2fe3d8a11da2f0ee498d474e21cd4f76850884b97c453ef4651aabff6b944e31d5946dfe63f14055e95650b2": 50,
  "047683e394ab3c57cb050894d3fac202fb49c7d831bf5807412e188feb1fa4bbbce9bfd88eaf874ead0636b4a677206c2d828a6191ebeeed0312221da4ae455dc3": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
