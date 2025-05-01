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
            try {
                const res = await axios.get(`http://127.0.0.1:8000/users/email/${email}`);
                if (res.data && res.data.length > 0) {
                    tmpErrors += "Duplicate emails are not permitted.\n";
                }
            } catch (e) {
                console.error(e);
            }
        }
        
        if (!displayName) {
            tmpErrors += "Valid display name must be entered.\n";
        }
        else{
            try {
                const res = await axios.get(`http://127.0.0.1:8000/users/displayName/${displayName}`);
                if (res.data && res.data.length > 0) {
                    tmpErrors += "Duplicate display names are not permitted.\n";
                }
            } catch (e) {
                console.error(e);
            }
        }
        
        if (!password || !confirmPassword || password !== confirmPassword) {
            tmpErrors += "Valid password must be entered.\n";
            
            if (password.includes(firstName) || password.includes(lastName) || password.includes(displayName) || password.includes(email.substring(0, email.indexOf("@")))) {
                tmpErrors += "Password must not include first name, last name, display name, or email.\n";
            }
        }
        
        // update the error state and abort if there are errors
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
                const res = await axios.post("http://127.0.0.1:8000/users/", newUser);
                //props.userHandlers.setUserID(res.data.url.replace('users/', "")); think this shouldn't be here    BANANAS
                navigate('/');
            } catch (e) {
                console.error(e);
            }

        }
        
    };
    
    // const register = (e) => {
    //     e.preventDefault();
        
    //     let tmpError = "";
    //     let otherUser;
    
    //     if(!firstName || !lastName){
    //         tmpError = errors;
    //         setErrors(tmpError + "First name / last name must be entered.");
    //     }
    //     if(!email || email.replaceAll("@", "").length !== email.length - 1){
    //         tmpError = errors;
    //         setErrors(tmpError + "Valid email must be entered.");
    //     }
    //     else{
    //         axios.get(`http://127.0.0.1:8000/users/email/${email}`)
    //         .then(async (res) => {
    //             otherUser = await res.data[0];
    //             if(otherUser){
    //                 tmpError = errors;
    //                 setErrors(tmpError + "Duplicate emails are not permitted.");
    //             }
    //         })
    //         .catch((e) => {
    //             console.error(e);
    //         })
    //     }
    //     if(!displayName){
    //         tmpError = errors;
    //         setErrors(tmpError + "Valid display name must be entered.");
    //     }
    //     else{
    //         axios.get(`http://127.0.0.1:8000/users/displayName/${displayName}`)
    //         .then(async (res) => {
    //             otherUser = await res.data[0];
    //             if(otherUser !== null){
    //                 tmpError = errors;
    //                 setErrors(tmpError + "Duplicate display names are not permitted.");
    //             }
    //         })
    //         .catch((e) => {
    //             console.error(e);
    //         })
    //     }

        
    //     //start stupid shit
    //     //end stupid shit

    //     if(!password || !confirmPassword || password !== confirmPassword){
    //         tmpError = errors;
    //         setErrors(tmpError + "Valid password must be entered.");
            
    //         if(password.includes(firstName) || password.includes(lastName) || password.includes(displayName) || password.includes(email.substring(0, email.indexOf("@")))){
    //             tmpError = errors;
    //             setErrors(tmpError + "Password must not include first name, last name, display name, or email.");
    //         }
    //     }
    //     console.log(errors);
    //     if(!errors){
    //         const newUser = {
    //             firstName: firstName,
    //             lastName: lastName,
    //             email: email,
    //             displayName: displayName,
    //             password: password
    //         }

    //         axios.post("http://127.0.0.1:8000/users/", newUser)
    //         .then((res) => {
    //             props.userHandlers.setUserID(res.data.url.replace('users/', ""));
    //             navigate('/');
    //         })
    //         .catch((e) => {
    //             console.error(e);
    //         })
    //     }
    // }
    
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
                            <input onChange={(e) => setEmail(e.target.value)} type="text" id="email-input" className="user-input-field" placeholder="johncena@johnny.com..." maxLength="40" required />
                        </div>
                        <div className="user-input-container">
                            <label htmlFor="display-name-input">Display name&nbsp;<span className="red-stars">*</span></label>
                            <input onChange={(e) => setDisplayName(e.target.value)} type="text" id="display-name-input" className="user-input-field" placeholder="RealJohnCena..." maxLength="40" required />
                        </div>
                        <div className="user-input-container">
                            <label htmlFor="password-input">Password&nbsp;<span className="red-stars">*</span></label>
                            <input onChange={(e) => setPassword(e.target.value)} type="text" id="password-input" className="user-input-field" placeholder="ucantCme123..." maxLength="40" required />
                        </div>
                        <div className="user-input-container">
                            <label htmlFor="confirm-password-input">Confirm Password&nbsp;<span className="red-stars">*</span></label>
                            <input onChange={(e) => setConfirmPassword(e.target.value)} type="text" id="confirm-password-input" className="user-input-field" placeholder="ucantCme123..." maxLength="40" required />
                        </div>
                        <p id="error-msgs">{errors}</p>
                        <button onClick={register} id="sign-up-button" type="submit">Sign Up</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default RegisterUser;