import axios from 'axios';
import {createContext, useState, useEffect} from 'react';
axios.defaults.withCredentials = true;

export const UserContext = createContext({})

export function UserContextProvider({children}){
    const [user, setUser] = useState(null);
    useEffect(() => {
        if(!user){
            console.log("User is null, fetching profile")
            axios.get("http://127.0.0.1:8000/auth/profile")
            .then((res) => {
                if(res.data){
                    axios.get(`http://127.0.0.1:8000/users/${res.data}`)
                    .then((res) => {
                        const user = {
                            displayName: res.data[0].displayName,
                            email: res.data[0].email,
                            id: res.data[0]._id,
                            userVotes: res.data[0].userVotes,
                            reputation: res.data[0].reputation,
                            accountCreationDate: res.data[0].accountCreationDate
                        }
                        setUser(user);
                    })
                    .catch(() => {
                        axios.get("http://127.0.0.1:8000/auth/logout")
                    });
                    
                }
                else{
                    setUser({displayName: "guest", email: null})
                }
            }).catch((e) => console.error(e))
        }
    }, [])

    return(
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}