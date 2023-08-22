import React, {useEffect, useState} from 'react';
import axios from "axios";

const App = () => {
    const [users, setUsers] = useState([])
    const [name, setName] = useState('')
    const [edit , setEdit] = useState(null)

    useEffect(() => {
        axios('https://64e2ef6bbac46e480e77ed78.mockapi.io/api/vector1/users')
            .then(({data}) => setUsers(data))
    }, [])

    const handleChange = (e, user) => {
        const newData = {...user, hired: e.target.checked}
        axios.put(`https://64e2ef6bbac46e480e77ed78.mockapi.io/api/vector1/users/${user.id}`, newData)
            .then(({data}) => {
                setUsers(users.map(user => user.id === data.id ? data : user))
            })
    }

    const handleDelete = (user) => {
        axios.delete(`https://64e2ef6bbac46e480e77ed78.mockapi.io/api/vector1/users/${user.id}`)
            .then(({data}) => {
                setUsers(users.filter(user => user.id !== data.id))
            })
    }

    const handleAddUser = (e, user) => {
        e.preventDefault()
        if (!!edit?.id){
            axios.put(`https://64e2ef6bbac46e480e77ed78.mockapi.io/api/vector1/users/${edit.id}`, {name})
                .then(({data}) => {
                    setUsers(users.map(user => user.id === data.id ? data : user))
                    setName('')
                    setEdit(null)
                })
        } else {
            axios.post(`https://64e2ef6bbac46e480e77ed78.mockapi.io/api/vector1/users/`, {name})
                .then(({data}) => {
                    setUsers([...users, data])
                    setName('')
                })
        }
    }

    const handleEdit = (user) => {
        setName(user.name)
        setEdit(user)
    }

    return (
        <div className={'container'}>
            <div>
                <form className={'search-wrapper'} onSubmit={handleAddUser}>
                    <input value={name} onChange={(e) => setName(e.target.value)} type="text"/>
                    <button type={'submit'}>{edit ? 'Edit user-name' : 'Add user-name'}</button>
                </form>
            </div>
            {
                users.map(user => {
                    return (
                        <div key={user.id} className={'user-wrapper'}>
                            <h2>{user.name}</h2>
                            <p>{user.email}</p>
                            <input type="checkbox" onChange={(e) => handleChange(e, user)} checked={user.hired}/>
                            <button onClick={() => handleDelete(user)}>Delete</button>
                            <button onClick={() => handleEdit(user)} >Edit</button>
                        </div>
                    )
                })
            }
        </div>
    );
};

export default App;
