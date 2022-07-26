const { Router } = require("express");
const router = Router();
const { Event, Owner, Provider } = require("../db");
const { mercadopago } = require("../utils/mercadoPago");
const { ACCESS_TOKEN } = process.env;

const payService = async (req, res) => {

  const { id, eventType, price } = req.body;
  const user = req.body.user;

  let payer = {
    name: user.given_name,
    surname: user.family_name,
    email: user.email
  };

  let preference = {
    payer_email: "test_user_41002316@testuser.com",
    items: [{
      title: eventType,
      id: id,
      quantity: 1,
      unit_price: price,
      currency_id: "ARS"
    }],
    payer: payer,
    back_urls: {
      failure: "/failure",
      pending: "/pending",
      success: "http://localhost:3000/confirmation",
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
      res.json({
        global: response.body.id
      });
    })
    .catch((err) => console.log(err));
};

router.post("/checkout", payService);

router.get("/confirmation", async (req, res, next) => {
  const id = req.body.data.id;
  try {
    if (id) {
      let res = await axios.get(`https://api.mercadopago.com/v1/payments/${id}?access_token=${ACCESS_TOKEN}`);
      res.send("Info");
    }
    res.send("Try again");
  } catch (err) {
    next(err)
  }
})

router.get("/", async (req, res, next) => {
  try {
    let allEvents = await Event.findAll({
      includes: [Owner, Provider]
    });
    allEvents.length 
    ? res.status(200).send(allEvents) 
    : res.status(400).send("Actualmente no existen reservas en el sitio");
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  const {
    date,
    eventType,
    comments,
    payment,
    ownerEmail,
    providerEmail,
    petName,
    ownerName,
    providerName,
    price,
    numberOfBooking
  } = req.body;
  try {
    // Busco al provider al que le voy a reservar
    let providerInfo = await Provider.findOne({
      where: {
        email: providerEmail
      }
    });
    let typeOfService = providerInfo.dataValues.service[0];
    // Reviso si incluye el horario que necesito en el día que quiero el servicio
    if (typeOfService === "paseo") {
      let schedule = providerInfo.dataValues.schedule.map(x => JSON.parse(x));
      const day = schedule.find(d => d[date.day]);
      if (day[date.day].includes(date.hour)) {
        // Guardo el evento asociado con el provider
        let event = await Event.findAll({
          where: {
            providerEmail
          }
        });
        let allEvents = event.map(e => e.dataValues);
        // Filtro todos los eventos que coincidan con el provider, día y fecha correspondientes
        allEvents = allEvents.filter( e =>
          e.providerEmail === providerEmail &&
          e.date.day === date.day &&
          e.date.hour === date.hour
        );
        let totalAllEvents = allEvents.length;
        await Event.findOrCreate({
          where: {
            ownerEmail,
            providerEmail,
            date,
            eventType
          },
          defaults: {
            date,
            eventType,
            comments,
            payment,
            ownerEmail,
            providerEmail,
            petName,
            ownerName,
            providerName,
            price,
            numberOfBooking
          },
        });
        // Actualizo la cantidad en allEvents
        totalAllEvents += 1;
        // Si la cantidad de eventos es igual a la cantidad de mascotas que puede pasear,
        // descartamos la opción para reservar en ese horario filtrando el schedule del provider
        if (totalAllEvents >= providerInfo.dataValues.dogsPerWalk) {
          filteredSchedule = day[date.day].filter((d) => d !== date.hour);
          let realFilteredSchedule = schedule.filter(s => !s[date.day]);
          realFilteredSchedule = [...realFilteredSchedule, {
            [date.day]: filteredSchedule
          }];
          providerUpdated = {
            ...providerInfo,
            schedule: realFilteredSchedule
          };
          Provider.update(providerUpdated, {
            where: {
              email: providerEmail
            }
          });
        }
        res.status(201).send("La reserva fue creada con éxito");
      } else {
        res.status(400).send("Este horario no está disponible.");
      }
    } else if (typeOfService === "hospedaje") {
      if (providerInfo.dataValues.schedule.includes(date.day)) {
        let event = await Event.findAll({
          where: {
            providerEmail
          }
        });
        let allEvents = event.map(e => e.dataValues);
        // Filtro todos los eventos que coincidan con el provider, día y fecha correspondientes
        allEvents = allEvents.filter(e => e.providerEmail === providerEmail && e.date.day === date.day);
        let totalAllEvents = allEvents.length;
        await Event.findOrCreate({
          where: {
            ownerEmail,
            providerEmail,
            date,
            eventType,
            petName
          },
          defaults: {
            date,
            eventType,
            comments,
            payment,
            ownerEmail,
            providerEmail,
            petName,
            ownerName,
            providerName,
            price,
            numberOfBooking
          },
        });
        // Actualizo la cantidad en allEvents
        totalAllEvents += 1;
        let typeOfService = providerInfo.dataValues.service[0];
        // Reviso si incluye el horario que necesito en el día que quiero el servicio
        if (typeOfService === 'paseo') {
          if (providerInfo.dataValues.schedule[date.day].includes(date.hour)) {
            // Guardo el evento asociado con el provider
            let event = await Event.findAll({
              where: {
                providerEmail
              }
            });
            let allEvents = event.map(e => e.dataValues);
            // Filtro todos los eventos que coincidan con el provider, día y fecha correspondientes
            allEvents = allEvents.filter(e => e.providerEmail === providerEmail && e.date.day === date.day && e.date.hour === date.hour);
            let totalAllEvents = allEvents.length;
            await Event.findOrCreate({
              where: {
                ownerEmail,
                providerEmail,
                date,
                eventType
              },
              defaults: {
                date,
                eventType,
                comments,
                payment,
                ownerEmail,
                providerEmail,
                petName,
                ownerName,
                providerName,
                price,
                numberOfBooking
              }
            });
            // Actualizo la cantidad en allEvents
            totalAllEvents += 1;
            // Si la cantidad de eventos es igual a la cantidad de mascotas que puede pasear,
            // descartamos la opción para reservar en ese horario filtrando el schedule del provider
            if (totalAllEvents >= providerInfo.dataValues.dogsPerWalk) {
              filteredSchedule = providerInfo.dataValues.schedule[date.day].filter(s => s !== date.hour)
              providerUpdated = {
                ...providerInfo,
                schedule: {
                  ...providerInfo.dataValues.schedule,
                  [date.day]: filteredSchedule
                }
              }
              Provider.update(providerUpdated, {
                where: {
                  email: providerEmail
                }
              })
            }
            res.status(201).send('La reserva fue creada con éxito');
          } else {
            res.status(400).send('Este horario no está disponible');
          }
        } else if (typeOfService === "hospedaje") {
          if (providerInfo.dataValues.schedule.includes(date.day)) {
            let event = await Event.findAll({
              where: {
                providerEmail
              }
            });
            let allEvents = event.map(e => e.dataValues);
            // Filtro todos los eventos que coincidan con el provider, día y fecha en cuestion 
            allEvents = allEvents.filter(e => e.providerEmail === providerEmail && e.date.day === date.day);
            let totalAllEvents = allEvents.length;
            await Event.findOrCreate({
              where: {
                ownerEmail,
                providerEmail,
                date,
                eventType,
                petName
              },
              defaults: {
                date,
                eventType,
                comments,
                payment,
                ownerEmail,
                providerEmail,
                petName,
                ownerName,
                providerName,
                price,
                numberOfBooking
              }
            });
            // Actualizo la cantidad de allEvents
            totalAllEvents += 1;
            // Si la cantidad de eventos es igual a la cantidad de mascotas que puede pasear,
            // descartamos la opción para reservar en ese horario filtrando el schedule del provider
            if (totalAllEvents >= providerInfo.dataValues.dogsPerWalk) {
              providerUpdated = {
                ...providerInfo,
                schedule: providerInfo.dataValues.schedule.filter(s => s !== date.day)
              }
              Provider.update(providerUpdated, {
                where: {
                  email: providerEmail
                }
              })
            }
            res.status(201).send('La reserva fue creada con éxito');
          } else {
            res.status(400).send('Este horario no está disponible.');
          }
        }
        res.status(201).send("La reserva fue creada con éxito");
      } else {
        res.status(400).send("Este horario no está disponible.");
      }
    }
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    await Event.update({
      isActive: false
    }, {
      where: {
        id: id
      }
    });
    return res.json("La reserva fue eliminada con éxito");
  } catch (err) {
    next(err);
  }
});

router.put("/schedule", async (req, res, next) => {
  const {
    providerEmail,
    schedule
  } = req.body;
  try {
    let userData = await Provider.findOne({
      where: {
        email: providerEmail
      }
    });
    userData = {
      ...userData,
      schedule
    };
    await Provider.update(userData, {
      where: {
        email: providerEmail
      }
    });
    return res.json("El horario de trabajo fue actualizado con éxito");
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const event = req.body;
  try {
    await Event.update(event, {
      where: {
        id: id
      }
    });
    return res.json("El evento fue modificado con éxito");
  } catch (err) {
    next(err);
  }
});

module.exports = router;