const User = require('../models//User');
const Spot = require('../models/Spot');

module.exports = {
    async index(req, res) {
        const tech = req.query.tech;

        const spots = await Spot.find({ techs: tech });

        return res.json(spots);
    },

    async store(req, res) {
        const filename = req.file.filename;
        const { company, techs, price } = req.body;
        const user_id = req.headers.user_id;

        const user = await User.findById(user_id);

        if (!user) {
            return res.status(400).json({ error: 'Usuario Nao existe!' });
        }

        const spot = await Spot.create({
            user: user_id,
            thumbnail: filename,
            company,
            // separa por virgula, mapei e remove os espacos entre as virgulas com o trim
            techs: techs.split(',').map(tech => tech.trim()),
            price
        })

        return res.json(spot)
    }
};