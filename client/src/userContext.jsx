import axios from 'axios';
import {createContext, useState, useEffect} from 'react';

export const UserContext = createContext({})

export function UserContextProvider({children}){
    const [user, setUser] = useState(null);
    useEffect(() => {
        if(!user){
            //axios.get('/profile')
            axios.get("http://127.0.0.1:8000/users/profile/profile", {withCredentials: true}).then((res) => {
                if(res.data){
                    axios.get(`http://127.0.0.1:8000/users/${res.data}`)
                    .then((res) =>{
                        const user = {
                            displayName: res.data[0].displayName,
                            email: res.data[0].email
                        }
                        setUser(user);
                    })
                }
            }).catch((e)=> {console.error(e)})
        }
    }, [])
    return(
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}