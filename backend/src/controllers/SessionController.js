const User = require('../models/User');

// Metodos disponiveis, index, show, store, update, destroy
// index seve para retornar uma listagem

module.exports = {
    async store(req, res) {
        const email = req.body.email

        //Procura se tem ja tem um usuario com o email
        let user = await User.findOne({ email });
         
        //Se nao tiver, ele cria um novo usuario
        if (!user) {
            user = await User.create({ email });
        }

        return res.json(user);
    }
};