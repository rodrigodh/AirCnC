import React, { useState, useMemo } from 'react';
import api from '../../services/api';

import camera from '../../assets/camera.svg'

import './styles.css';

export default function New({ history }) {
    const [thumbnail, setThumbnail] = useState(null);
    const [company, setCompany] = useState('');
    const [techs, setTechs] = useState('');
    const [price, setPrice] = useState('');

    //Ao ver uma mudanca na variavel thumbnail dispara a funcao, assim como no useEffect
    // Sobre a funcao, se existir uma thumbnail, cria uma url para uma variavel temporaria que ainda nao teve upload, se nao retorna null

    const preview = useMemo(() => {
        return thumbnail ? URL.createObjectURL(thumbnail) : null;
    }, [thumbnail])

    async function handleSubmit(event) {
        event.preventDefault();
        //Se usa data com Multipart Form
        const data = new FormData();
        const user_id = localStorage.getItem('user')

        data.append('thumbnail', thumbnail);
        data.append('company', company);
        data.append('techs', techs);
        data.append('price', price);

        // primeiro parametro eh a rota, segundo parametro os dados, terceiro parametro um obj com infos adicionais como o header
        const response = await api.post('/spots', data, {
            headers: { user_id }
        })

        console.log(response.data)
        history.push('dashboard');
    }

    return (
        <form onSubmit={handleSubmit}>
            <label
                id="thumbnail"
                style={{ backgroundImage: `url(${preview})` }}
                className={thumbnail ? 'has-thumbnail' : ''}
            >
                <input type="file" onChange={event => setThumbnail(event.target.files[0])} />
                <img src={camera} alt="Select img" />
            </label>

            <label htmlFor="company">EMPRESA * </label>
            <input
                id="company"
                placeholder="Sua empresa incrível"
                value={company}
                onChange={event => setCompany(event.target.value)}
            />

            <label htmlFor="techs">TECNOLOGIAS * <span className="parenteses">(separadas por vírgula.)</span></label>
            <input
                id="techs"
                placeholder="Quais tecnologias usam?"
                value={techs}
                onChange={event => setTechs(event.target.value)}
            />

            <label htmlFor="price">VALOR DA DIÁRIA * <span className="parenteses">(em branco para GRATUITO.)</span></label>
            <input
                id="price"
                placeholder="Valor cobrado por dia."
                value={price}
                onChange={event => setPrice(event.target.value)}
            />

            <button className="btn"> Enviar </button>
        </form>
    );
}