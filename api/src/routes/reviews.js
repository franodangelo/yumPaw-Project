const { Router } = require ('express');
router = Router();
const { Review, Owner, Provider} = require('../db');

router.get('/', async (req, res, next) => {
    try {
        const reviews = await Review.findAll({
            include: [Owner, Provider]
        })
        res.status(201).json(reviews);
    } catch (err) {
        res.status(404).send('No existen reseñas en la plataforma');
    }
});

router.post('/', async (req, res, next) => {
    const { ownerEmail, providerEmail, OwnerName, review, message } = req.body;
    try {
        const reviews = await Review.findOrCreate({
            where: {
                ownerEmail,
                providerEmail
            },
            defaults: {
                ownerEmail,
                providerEmail,
                name: OwnerName,
                review,
                message
            }
        })
        res.status(201).json(reviews);
    } catch (err) {
        next(err);
    }
});

router.put('/', async (req, res, next) =>{
    const newReview = req.body;
    try{
        await Review.update(newReview, {
            where:{
                id: newReview.id
            }
        }) 
        return res.json('El usuario fue modificado con éxito');
    }catch(err){
        next(err)
    }
});

module.exports = router;