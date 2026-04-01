const router = require("express").Router();

router.get("/", (req, res) => {
  res.json("Expense route working");
});

module.exports = router;