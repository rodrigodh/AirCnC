const mongoose = require('mongoose');

const SpotSchema = new mongoose.Schema({
    thumbnail: String,
    company: String,
    price: Number,
    techs: [String],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    // necessario para o link da thumb aparecer na res
    toJSON: {
        virtuals: true,
    }
    });

// Transforma a thumb em link para usar no frontend
SpotSchema.virtual('thumbnail_url').get(function () {
    return `http://192.168.132.2:3333/files/${this.thumbnail}`
});

module.exports = mongoose.model('Spot', SpotSchema); 