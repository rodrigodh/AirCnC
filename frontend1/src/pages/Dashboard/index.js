import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import socketio from 'socket.io-client';
import api from '../../services/api';

import './styles.css';

export default function Dashboard() {
    const [spots, setSpots] = useState([]);
    const [requests, setRequests] = useState([]);

    const user_id = localStorage.getItem('user');
    //refaz a conexao do usuario caso o id dele mude, caso contrario nao faz
    const socket = useMemo(() => socketio('http://localhost:3333', {
        query: { user_id },
    }), [user_id]);

    //Se conecta com o socket.io e faz o que nos pedirmos
    useEffect(() => {
        socket.on('booking_request', data => {
            setRequests([...requests, data]);
        })
    }, [requests, socket])

    // A arrow function do useEffect so funciona quando algo dentro da array for atualizado, se o array estiver vazio,
    // eh o mesmo que pedir pra executar uma unica vez
    useEffect(() => {
        async function loadSpots() {
            const user_id = localStorage.getItem('user');
            const response = await api.get('/dashboard', {
                headers: { user_id }
            });

            setSpots(response.data);
        }

        loadSpots();
    }, []);

    async function handleAccept(id) {
        await api.post(`/bookings/${id}/approval`)

        setRequests(requests.filter(request => request._id !== id));
    }

    async function handleReject(id) {
        await api.post(`/bookings/${id}/reject`)

        setRequests(requests.filter(request => request._id !== id));
    }

    return (
        <>
            <ul className='notifications'>
                {requests.map(request => (
                    <li key={request._id}>
                        <p>
                            <strong>{request.user.email}</strong> está solicitando uma reserva em <strong>{request.spot.company}</strong> para a data: {request.date}
                        </p>
                        <button className='accept' onClick={() => handleAccept(request._id)}>ACEITAR</button>
                        <button className='reject' onClick={() => handleReject(request._id)}>REJEITAR</button>
                    </li>
                ))}

            </ul>
            <ul className="spot-list">
                {spots.map(spot => (
                    <li key={spot._id}>
                        <header style={{ backgroundImage: `url(${spot.thumbnail_url})` }} />
                        <strong>{spot.company}</strong>
                        <span>{spot.price ? `R$${spot.price}/dia` : 'GRATUITO'}</span>
                    </li>
                ))}
            </ul>

            <Link to="/new">
                <button className='btn'> Cadastrar Novo Spot </button>
            </Link>
        </>
    );
}