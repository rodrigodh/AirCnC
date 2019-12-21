import React, { useState } from 'react';
import api from '../../services/api';

export default function Login({ history }) {
    const [email, setEmail] = useState('');


    async function handleSubmit(event) {

        event.preventDefault()

        const response = await api.post('/sessions', { email })
        //como tem o mesmo nome (email) fica apenas email, mas se tiver nome diferente da api seria 'email: email' por exemplo
        const _id = response.data._id

        localStorage.setItem('user', _id);

        history.push('/dashboard');
    }

    function handleEmail(event) {
        //lugar onde fica o texto do input e sempre event.target.value
        setEmail(event.target.value)
    }

    return (
        <>
            <p>
                Ofereça <strong>spots</strong> para programadores e encontre <strong>talentos</strong> para sua empresa
            </p>

            <form onSubmit={handleSubmit}>
                <label htmlFor="email">E-MAIL *</label>
                <input
                    id="email"
                    type="email"
                    placeholder="Seu melhor E-mail"
                    onChange={handleEmail}
                />

                <button className="btn" type="submit">Entrar</button>
            </form>
        </>
    )
}