const Booking = require('../models/Booking');

module.exports = {
    async store(req, res) {
        const { user_id } = req.headers;
        const spot_id = req.params.spot_id;
        const date = req.body.date;

        const booking = await Booking.create({
            user: user_id,
            spot: spot_id,
            date,
        });

        // de alguma forma magica pega os dados do user e do spot pelo id :D
        await booking.populate('spot').populate('user').execPopulate();

        const ownerSocket = req.connectedUsers[booking.spot.user]

        if (ownerSocket) {
            req.io.to(ownerSocket).emit('booking_request', booking);
        }

        return res.json(booking);
    }
};