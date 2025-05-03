import '../../stylesheets/CreateCommunityView.css'
import '../../stylesheets/App.css'
import {useState} from 'react'
import {hyperLink} from '../../functions';
import axios from 'axios';

//App.js->phreddit.js->main.jsx->content.jsx->createCommunityView.jsx
const CreateCommunityView = (props) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [username, setUsername] = useState("");

    if(props.visibility === false){
        return null;
    }

    const resetInputs = () => {
        setName("");
        setDescription("");
        setUsername("");
    }

    const engenderCommunity = async (e) => {
        e.preventDefault();
        let alertMsg = "";

        if(!name){
            alertMsg += "*Name cannot be blank*\n";
        }
        (props.allData.communities).forEach((comm) => {(comm.name.toLowerCase().trim() === name.toLowerCase().trim()) ? alertMsg += "*Community already exists*" : alertMsg += ""});
        if(!description){
            alertMsg += "*Description cannot be blank*\n";
        }
        if(!username){
            alertMsg += "*Username cannot be blank*\n";
        }
        if(alertMsg !== ""){
            alert(alertMsg)
        }
        
        let hyperlink = hyperLink(description, false);
        let validHyperLink = true;
        if(hyperlink.length > 1){
            validHyperLink = false;
            if(hyperlink[0].props){
                if((hyperlink[0].props.children !== "") && (hyperlink[0].props.href.startsWith("http://") || hyperlink[0].props.href.startsWith("https://"))){
                    validHyperLink = true;
                }
            }
            else{
                if((hyperlink[1].props.children !== "") && (hyperlink[1].props.href.startsWith("http://") || hyperlink[1].props.href.startsWith("https://"))){
                    validHyperLink = true;
                }
            }
        }

        if(alertMsg === "" && validHyperLink){
            const newCommunity =
            {
                name: `${name}`,
                description: `${description}`,
                postIDs: [],
                startDate: new Date(),
                members: [`${username}`],
            }
            resetInputs();
            axios.post("http://127.0.0.1:8000/communities", newCommunity)
            .then(async (res) => {
                await axios.get("http://127.0.0.1:8000/communities")
                .then((res) => {
                    props.allUpdaters.updateCommunities(res.data)
                    props.allUpdaters.setSelectedItem(res.data[res.data.length - 1].url);
                })
                .catch((e) => {
                    console.error(e);
                })
            })
            .catch((e) => {
                console.error(e);
            })
            
            props.allOpeners.openHomePage();
        }
    }

    return(
        <div id="create-community-view">
            <h1 id="create-community-view-title" className='h1-fixer'>Create a New Community</h1>
            <form htmlFor="create-community-name" id="create-community-form">
                <div id="create-community-input-div">
                    <div className="community-input-container" id="community-name-container">
                        <label className="community-label" htmlFor="community-name">Community Name (required, max 100 characters):&nbsp;<span className="red-stars">*</span></label>
                        <input onChange={(e) => setName(e.target.value)} className="community-input-field" type="text" id="community-name" name="community-name" maxLength="100" placeholder="Community Name..." required />
                    </div>
                    <div className="community-input-container" id="community-description-container">
                        <label className="community-label" htmlFor="community-description">Community Description (required, max 500 characters):&nbsp;<span className="red-stars">*</span></label>
                        <textarea onChange={(e) => setDescription(e.target.value)} className="community-input-field" type="text" id="community-description" name="community-description" maxLength="500" placeholder="Description..." required></textarea>
                    </div>
                    <div className="community-input-container" id="community-creator-username-container">
                        <label className="community-label" htmlFor="creator-username">Creator Username (required):&nbsp;<span className="red-stars">*</span></label>
                        <input onChange={(e) => setUsername(e.target.value)} className="community-input-field" type="text" id="creator-username" name="creator-username" maxLength="25" placeholder="Username..." required />
                    </div>
                    <button id="engender-community-button" type="submit" onClick={engenderCommunity}>Engender Community</button>
                </div>
            </form>
        </div>
    );
};

export default CreateCommunityView;