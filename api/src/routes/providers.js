const { Router } = require('express');
const router = Router();
const { Provider } = require('../db');
const { Op } = require('sequelize');

router.get('/', async (req, res, next) => {
    const { name } = req.query;
    let allProviders;
    try {
        if (name) {
            allProviders = await Provider.findAll({
                include: Review,
                where: {
                    name: {
                        [Op.iLike]: '%' + name + '%'
                    }
                }
            })
        } else {
            allProviders = await Provider.findAll({});
        }
        allProviders.length 
        ? res.status(200).send(allProviders) 
        : res.status(400).send('No hay usuarios cargados en la plataforma');
    } catch (err) {
        next(err)
    }
});

router.get('/:email', async (req, res, next) => {
    const { email } = req.params;
    try {
        let providerId = await Provider.findByPk(email);
        res.send(providerId);
    } catch (err) {
        next(err)
    }
});

router.post('/', async (req, res, next) => {
    const {
        name,
        lastName,
        email,
        profilePicture,
        address,
        service,
        description,
        price,
        typeOfHousing,
        housingPhotos,
        schedule,
        dogsPerWalk,
        longitude,
        latitude
    } = req.body;
    let auxName = name.toLowerCase();
    let auxLastName = lastName.toLowerCase();
    try {
        await Provider.findOrCreate({
            where: {
                email: email
            },
            defaults: {
                name: auxName,
                lastName: auxLastName,
                email,
                profilePicture,
                adress: address,
                name: auxName,
                lastName: auxLastName,
                email,
                profilePicture,
                service,
                description,
                price,
                typeOfHousing,
                housingPhotos,
                schedule,
                dogsPerWalk,
                latitude,
                longitude
            }
        })
        res.status(201).send('El usuario fue creado con éxito');
    } catch (err) {
        next(err)
    }
});

router.put('/', async (req, res, next) => {
    const provider = req.body;
    try {
        await Provider.update(provider, {
            where: {
                email: provider.email
            }
        })
        return res.json('El usuario fue modificado con éxito');
    } catch (err) {
        next(err)
    }
});

router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        await Provider.destroy({
            where: {
                id: id
            }
        })
        return res.json('El usuario fue elimindo con éxito');
    } catch (err) {
        next(err)
    }
});

module.exports = router;