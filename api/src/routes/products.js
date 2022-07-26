const { Router } = require("express");
const router = Router();
const { Op } = require("sequelize");
const { Product } = require("../db");
const { mercadopago } = require("../utils/mercadoPago");
const { ACCESS_TOKEN } = process.env;

const payProduct = async (req, res) => {
  const cart = req.body.cart;
  const user = req.body.user;

  let items = [];
  
  cart.forEach((i) =>
    items.push({
      service: i.name,
      id: i.id,
      quantity: i.quantity,
      title: i.name,
      unit_price: i.price,
      currency_id: "ARS"
    })
  );

  let payer = {
    name: user.given_name,
    surname: user.family_name
  };

  let preference = {
    payer_email: "test_user_41002316@testuser.com",
    items: items,
    payer: payer,
    back_urls: {
      failure: "/failure",
      pending: "/pending",
      success: "http://localhost:3000/confirmacion"
    },
    notification_url: "https://1bbb-181-168-161-231.sa.ngrok.io/products/notificacion",
    auto_return: "approved"
  };

  mercadopago.preferences
    .create(preference)
    .then((response) => {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "POST");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.set("Access-Control-Max-Age", "3600");
      res.set("Access-Control-Allow-Credentials", true);
      console.log("URL: ", response.body.init_point);
      res.json({
        global: response.body.id
      });
    })
    .catch(err => console.log(err));
};

router.post("/checkout", payProduct);

const orderNotification = async (req, res) => {
  try {
    res.status(200).send("Notification sent");
  } catch (err) {
    next(err)
  }
};

router.post("/notificacion", orderNotification);

router.get("/confirmation", async (req, res, next) => {
  const id = req.body.data.id;
  try {
    if (id) {
      let res = await axios.get(`https://api.mercadopago.com/v1/payments/${id}?access_token=${ACCESS_TOKEN}`);
      res.send("Info");
    }
    res.send("Try again");
  } catch (err) {
    next(err);
  }
})

router.get("/", async (req, res, next) => {
  const { name } = req.query;
  let allProducts;
  try {
    if (name) {
      allProducts = await Product.findAll({
        where: {
          name: {
            [Op.iLike]: "%" + name + "%",
          }
        }
      });
    } else {
      allProducts = await Product.findAll({});
    }
    allProducts
      ? res.status(200).send(allProducts)
      : res.status(400).send("No hay productos cargados en la plataforma");
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    let productById = await Product.findByPk(id);
    res.send(productById)
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    let productById = await Product.findByPk(id);
    res.send(productById)
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  const {
    name,
    category,
    weight,
    price,
    stock,
    profilePicture,
    targetAnimal,
    tradeMark,
    description
  } = req.body;
  try {
    await Product.findOrCreate({
      where: {
        name,
        category,
        weight,
        price,
        stock,
        profilePicture,
        description,
        targetAnimal,
        tradeMark,
        description
      }
    });
    res.status(201).send("El producto fue agregado con éxito");
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const product = req.body;
  try {
    await Product.update(product, {
      where: {
        id: id
      }
    });
    return res.json("El producto fue modificado con éxito");
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    await Product.update({
      isActive: false,
    }, {
      where: {
        id: id
      }
    });
    return res.json("El producto fue eliminado con éxito");
  } catch (err) {
    next(err);
  }
});

module.exports = router;