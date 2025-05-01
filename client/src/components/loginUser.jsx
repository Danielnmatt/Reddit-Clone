import {useNavigate} from 'react-router-dom'
import '../stylesheets/App.css'
import '../stylesheets/RegisterUser.css'
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
        let userID = "";
        
        if(!email || !password){
            tmpErrors += "Email and password must be entered.";
        }
        else{
            try {
                const res = await axios.get(`http://127.0.0.1:8000/users/email/${email}`);
                if (!res.data || res.data.length == 0) {//incorrect email
                    tmpErrors += `No account matching the email \" ${email} \" has been found.`;
                }
                else{
                    const user = res.data[0];
                    userID = user.url.replace("users/", "");
                    
                    console.log(userID);
                    try{
                        const res1_5 = await axios.post(`http://127.0.0.1:8000/users/comparepassword/${userID}`, {password: password});
                        console.log(res1_5.data);
                    }
                    catch(e){
                        console.log("FUCK");
                        console.error(e);
                    }
                    //const res2 = await axios.post(`http://127.0.0.1:8000/users/comparepassword/${userID}`, password);
                    //console.log(res2);

                    // if(user.password !== password){
                    //     tmpErrors += "Incorrect password.";
                    // }
                }
            }
            catch (e){
                console.log("HEHREHREHRHERHEHRE");
                console.error(e);
            }
        }
        
        // update the error state and abort if there are errors
        if (tmpErrors) {
            setErrors(tmpErrors);
            return;
        }
        else{
            props.userHandlers.setUserID(userID);
            navigate('/phreddit');
        }
        
    };
    
    return(
        <div id="register-parent">
            <div id="register-container">
                <h1 id="register-text" className="h1-fixer">LOGGING IN USER</h1>
                <div id="register-div">
                    <form id="register-user-form">
                        <div className="user-input-container">
                            <label htmlFor="email-input">Email&nbsp;<span className="red-stars">*</span></label>
                            <input onChange={(e) => setEmail(e.target.value)} type="text" id="email-input" className="user-input-field" placeholder="johncena@johnny.com..." defaultValue="johncena@johnny.com" maxLength="40" required />
                        </div>
                        <div className="user-input-container">
                            <label htmlFor="password-input">Password&nbsp;<span className="red-stars">*</span></label>
                            <input onChange={(e) => setPassword(e.target.value)} type="text" id="password-input" className="user-input-field" placeholder="ucantCme123..." required />
                        </div>
                        <p id="error-msgs">{errors}</p>
                        <button onClick={login} id="sign-up-button" type="submit">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default LoginUser;