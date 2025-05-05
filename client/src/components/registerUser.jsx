import {useNavigate} from 'react-router-dom'
import '../stylesheets/App.css'
import '../stylesheets/RegisterUser.css'
import {useState} from 'react'
import axios from 'axios'

const RegisterUser = (props) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState("");
    const navigate = useNavigate();

    const register = async (e) => {
        e.preventDefault();
        
        let tmpErrors = "";
        
        if (!firstName || !lastName) {
            tmpErrors += "First name / last name must be entered.\n";
        }
        
        if (!email || email.replaceAll("@", "").length !== email.length - 1) {
            tmpErrors += "Valid email must be entered.\n";
        }
        else{
            try{
                const res = await axios.get(`http://127.0.0.1:8000/users/email/${email}`);
                if(res.data && res.data.length > 0){
                    tmpErrors += "Duplicate emails are not permitted.\n";
                }
            }
            catch(e){
                console.error(e);
            }
        }
        
        if (!displayName) {
            tmpErrors += "Display name must be entered.\n";
        }
        else{
            try{
                const res = await axios.get(`http://127.0.0.1:8000/users/displayName/${displayName}`);
                if(res.data && res.data.length > 0){
                    tmpErrors += "Duplicate display names are not permitted.\n";
                }
            }
            catch(e){
                console.error(e);
            }
        }

        if(!password || !confirmPassword){
            tmpErrors += "Password must be entered.\n";
        }
        else if(password !== confirmPassword){
            tmpErrors += "Passwords must match.\n";
        }
        else if(password.includes(firstName) || password.includes(lastName) || password.includes(displayName) || password.includes(email.substring(0, email.indexOf("@")))){
            tmpErrors += "Password must not include name, display name, or email.\n";
        }
        
        if (tmpErrors) {
            tmpErrors = (tmpErrors.slice(-1) === '\n') ? (tmpErrors.substring(0, tmpErrors.length - 1)) : tmpErrors;
            setErrors(tmpErrors);
            return;
        }
        else{
            const newUser = {
                firstName,
                lastName,
                email,
                displayName,
                password
            };
            
            try {
                axios.post("http://127.0.0.1:8000/auth/register", newUser, {withCredentials: true});
                navigate('/');
            }
            catch (e) {
                console.error(e);
            }
        }
        
    };
    
    return(
        <div id="register-parent">
            <div id="register-container">
                <h1 id="register-text" className="h1-fixer">REGISTERING USER</h1>
                <div id="register-div">
                    <form id="register-user-form">
                        <div className="user-input-container">
                            <label htmlFor="user-firstname-input">First name&nbsp;<span className="red-stars">*</span></label>
                            <input onChange={(e) => setFirstName(e.target.value)} type="text" id="user-firstname-input" className="user-input-field" placeholder="John..." maxLength="40" required />
                        </div>
                        <div className="user-input-container">
                            <label htmlFor="user-lastname-input">Last name&nbsp;<span className="red-stars">*</span></label>
                            <input onChange={(e) => setLastName(e.target.value)} type="text" id="user-lastname-input" className="user-input-field" placeholder="Cena..." maxLength="40" required />
                        </div>
                        <div className="user-input-container">
                            <label htmlFor="email-input">Email&nbsp;<span className="red-stars">*</span></label>
                            <input onChange={(e) => setEmail(e.target.value.toLowerCase())} type="text" id="email-input" className="user-input-field" placeholder="johncena@johnny.com..." maxLength="40" required />
                        </div>
                        <div className="user-input-container">
                            <label htmlFor="display-name-input">Display name&nbsp;<span className="red-stars">*</span></label>
                            <input onChange={(e) => setDisplayName(e.target.value)} type="text" id="display-name-input" className="user-input-field" placeholder="RealJohnCena..." maxLength="40" required />
                        </div>
                        <div className="user-input-container">
                            <label htmlFor="password-input">Password&nbsp;<span className="red-stars">*</span></label>
                            <input onChange={(e) => setPassword(e.target.value)} type="password" id="password-input" className="user-input-field" placeholder="ucantCme123..." maxLength="40" required />
                        </div>
                        <div className="user-input-container">
                            <label htmlFor="confirm-password-input">Confirm Password&nbsp;<span className="red-stars">*</span></label>
                            <input onChange={(e) => setConfirmPassword(e.target.value)} type="password" id="confirm-password-input" className="user-input-field" placeholder="ucantCme123..." maxLength="40" required />
                        </div>
                        <p id="error-msgs">{errors}</p>
                        <div className="page-buttons-div">
                            <button onClick={register} className="page-buttons" type="submit">Sign Up</button>
                            <button onClick={() => navigate('/')} className="page-buttons" type="cancel">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default RegisterUser;