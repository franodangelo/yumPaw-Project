const { Router } = require('express');
const router = Router();
const { Owner, Pet, Sold } = require('../db');

router.get('/', async (req, res, next) => {
    try {
        let allOwners = await Owner.findAll({
            include: [Pet, Sold],
            order: [
                ['name', 'ASC']
            ]
        })
        allOwners.length ?
            res.status(200).send(allOwners) :
            res.status(400).send('No existen usuarios cargados en la plataforma');
    } catch (err) {
        next(err)
    }
});

router.get('/:email', async (req, res, next) => {
    const { email } = req.params;
    try {
        let ownerId = await Owner.findByPk(email);
        res.send(ownerId);
    } catch (error) {
        next(error)
    }
});

router.get('/getFavorites/:email', async (req, res, next) => {
    const { email } = req.params;
    try {
        let owner = await Owner.findOne({
            where: {
                email,
            }
        })
        owner && owner.favorites && owner.favorites.length 
        ? res.status(200).send(owner.favorites) 
        : res.status(400).send('No existen usuarios favoritos actualmente');
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
        latitude,
        longitude
    } = req.body;
    try {
        await Owner.findOrCreate({
            where: {
                email: email
            },
            defaults: {
                name,
                lastName,
                email,
                profilePicture,
                address,
                latitude,
                longitude
            }
        })
        res.status(201).send('Usuario creado con éxito');
    } catch (err) {
        next(err)
    }
});

router.put('/addFavorite', async (req, res, next) => {
    const newOwner = req.body;
    try {
        await Owner.update(newOwner, {
            where: {
                email: newOwner.email
            }
        })
        return res.json('El usuario fue modificado con éxito')
    } catch (err) {
        next(err)
    }
});

router.put('/:email', async (req, res, next) => {
    const id = req.params.email;
    const owner = req.body;
    try {
        await Owner.update(owner, {
            where: {
                email: id
            }
        })
        return res.json('El usuario fue modificado con éxito');
    } catch (err) {
        next(err)
    }
});

router.delete('/:id', async (req, res, next) => {
    const id = req.params.email;
    try {
        await Owner.update({
            isActive: false
        }, {
            where: {
                email: id
            }
        })
        return res.json('El usuario fue eliminado con éxito');
    } catch (err) {
        next(err)
    }
});

module.exports = router;