const { Router } = require("express");
const router = Router();
const { Sold, Owner } = require("../db");

router.get("/", async (req, res, next) => {
  try {
    let allSolds = await Sold.findAll({});
    allSolds.length ?
      res.status(200).send(allSolds) :
      res.status(400).send("No hay ventas en la plataforma");
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  const {
    id,
    first_name,
    last_name,
    items,
    status,
    date_created,
    transaction_amount,
    email
  } = req.body;
  try {
    let newSold = await Sold.create({
      id,
      first_name,
      last_name,
      items,
      status,
      date_created,
      transaction_amount
    });
    let found = await Owner.findOne({
      where: {
        email: email
      }
    });
    await found.addSold(newSold);
    res.status(201).send("La venta fue cargada con éxito");
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    let soldById = await Sold.findByPk(id);
    res.send(soldById);
  } catch (err) {
    next(err)
  }
})

module.exports = router;