const { Router } = require('express');
const router = Router();
const { Owner, Pet } = require('../db');

router.get('/', async (req, res, next) => {
    try {
        let allPets = await Pet.findAll({
            order: [
                ['name', 'ASC']
            ]
        })
        allPets.length 
        ? res.status(200).send(allPets) 
        : res.status(400).send('No hay mascotas cargadas en la plataforma');
    } catch (err) {
        next(err)
    }
});

router.post('/', async (req, res, next) => {
    const {
        name,
        type,
        race,
        size,
        photos,
        description,
        ownerEmail
    } = req.body;
    let auxName = name.toLowerCase();
    try {
        let newPet = await Pet.create({
            name: auxName,
            type,
            race,
            size,
            profilePicture: photos,
            description
        })
        let found = await Owner.findOne({
            where: {
                email: ownerEmail
            }
        })
        await found.addPet(newPet);
        res.status(201).send('El usuario fue creado con éxito');
    } catch (err) {
        next(err)
    }
});

router.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const pet = req.body;
    try {
        await Pet.update(pet, {
            where: {
                id: id
            }
        })
        return res.json('La mascota fue modificada con éxito');
    } catch (err) {
        next(err)
    }
});

router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        await Pet.update({
            isActive: false
        }, {
            where: {
                id: id
            }
        })
        return res.json('La mascota fue eliminada con éxito');
    } catch (err) {
        next(err)
    }
});

module.exports = router;