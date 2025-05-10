import {Link} from 'react-router-dom'
import '../stylesheets/App.css'
import '../stylesheets/Welcome.css'
import axios from 'axios'
import {useContext} from 'react';
import {UserContext} from '../userContext'
import {useNavigate} from 'react-router-dom'
axios.defaults.withCredentials = true;

const Welcome = () => {
    const navigate = useNavigate();
    const {setUser} = useContext(UserContext);
    const handleGuest = async () => {
        try{
            await axios.get("http://127.0.0.1:8000/auth/logout")
            await axios.get("http://127.0.0.1:8000/auth/guest")
            .then((res) => setUser(res.data.user))
            .catch((e) => console.error(e));
        }
        catch(e){
            console.error(e);
        }
    }
    const handleAlreadyLoggedIn = async () => {
        const profile = await axios.get("http://127.0.0.1:8000/auth/profile")
        if(profile.data){
            const user = await axios.get(`http://127.0.0.1:8000/users/${profile.data}`);
            setUser({
                displayName: user.data[0].displayName,
                email: user.data[0].email,
                id: user.data[0]._id,//why do we need this one
                userVotes: user.data[0].userVotes,
                reputation: user.data[0].reputation,
                accountCreationDate: user.data[0].accountCreationDate
            });
            navigate('/phreddit')
        }
    }

    return(
        <div id="welcome-parent">
            <div id="welcome-container">
                <h1 id="welcome-text" className="h1-fixer">Welcome</h1>
                <div id="welcome-div">
                    <Link to="/register" className="welcome-link clickables_group3">
                        <h2 className="welcome-options">Register as a new user</h2>
                    </Link>
                    <Link to="/login" className="welcome-link clickables_group3" onClick={handleAlreadyLoggedIn}>
                        <h2 className="welcome-options">Login</h2>
                    </Link>
                    <Link to="/phreddit" className="welcome-link clickables_group3" onClick={handleGuest}>
                        <h2 className="welcome-options">Continue as guest</h2>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Welcome;