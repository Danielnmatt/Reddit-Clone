import {useNavigate} from 'react-router-dom'
import '../stylesheets/App.css'
import '../stylesheets/LoginUser.css'
import {useState} from 'react'
import axios from 'axios'

const LoginUser = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState("");
    const navigate = useNavigate();
    
    const login = async (e) => {
        e.preventDefault();
        let tmpErrors = "";
        
        if(!email || !password){
            tmpErrors += "Email and password must be entered.\n";
        }
        else{
            try {
                await axios.post("http://127.0.0.1:8000/users/login", {email: email, password: password}, {withCredentials: true});
            }
            catch(e){
                tmpErrors += "Incorrect email or password.\n";
            }
        }

        if(tmpErrors){
            tmpErrors = (tmpErrors.slice(-1) === '\n') ? (tmpErrors.substring(0, tmpErrors.length - 1)) : tmpErrors;
            setErrors(tmpErrors);
            return;
        }
        else{
            navigate('/phreddit');
        }
        
    };
    
    return(
        <div id="login-parent">
            <div id="login-container">
                <h1 id="login-text" className="h1-fixer">LOGGING IN USER</h1>
                <div id="login-div">
                    <form id="login-user-form">
                        <div className="user-input-container">
                            <label htmlFor="email-input">Email&nbsp;<span className="red-stars">*</span></label>
                            <input onChange={(e) => setEmail(e.target.value.toLowerCase())} type="text" id="email-input" className="user-input-field" placeholder="johncena@johnny.com..." maxLength="40" required />
                        </div>
                        <div className="user-input-container">
                            <label htmlFor="password-input">Password&nbsp;<span className="red-stars">*</span></label>
                            <input onChange={(e) => setPassword(e.target.value)} type="password" id="password-input" className="user-input-field" placeholder="ucantCme123..." maxLength="40" required />
                        </div>
                        <p id="error-msgs">{errors}</p>
                        <div className="page-buttons-div">
                            <button onClick={login} className="page-buttons" type="submit">Login</button>
                            <button onClick={() => navigate('/')} className="page-buttons" type="cancel">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default LoginUser;