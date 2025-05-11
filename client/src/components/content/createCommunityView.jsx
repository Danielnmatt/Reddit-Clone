import '../../stylesheets/CreateCommunityView.css'
import '../../stylesheets/App.css'
import {useState, useEffect} from 'react'
import {hyperLink} from '../../functions';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
axios.defaults.withCredentials = true;

//App.js->phreddit.js->main.jsx->content.jsx->createCommunityView.jsx
const CreateCommunityView = (props) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    const resetInputs = () => {
        setName("");
        setDescription("");
    }

    useEffect(() => {
        if(props.allData.selectedItem === 'edit-community-button' && props.editingCommunity){
            setName(props.editingCommunity.name);
            setDescription(props.editingCommunity.description);
        }
        if(props.allData.selectedItem === 'create-communities-button'){
            resetInputs();
        }
    }, [props.allData.selectedItem, props.editingCommunity])

    if(props.visibility === false){
        return null;
    }


    let happenedAlready = false;
    const handlePossibleBadAuthentication = e => {
        console.error(e);
        if((e.status === 401 || e.status === 403) && !happenedAlready){
            happenedAlready = true;
            alert("Your session is expired or invalidated. You will be redirected.");
            axios.get("http://127.0.0.1:8000/auth/logout").then(() => console.log("logout success")).catch(() => console.log("logout unsuccessful"));
            navigate("/")
        }
    }

    const engenderCommunity = async (e) => {
        e.preventDefault();
        let alertMsg = "";

        if(!name){
            alertMsg += "*Name cannot be blank*\n";
        }

        const res = await axios.get("http://127.0.0.1:8000/communities");
        const allCommunities = res.data;
        
        if(props.allData.selectedItem === 'edit-community-button'){
            allCommunities.forEach((comm) => {
                (comm.name.toLowerCase().trim() === name.toLowerCase().trim() && name !== props.editingCommunity.name) ? alertMsg += "*Community already exists*" : alertMsg += ""
            });
        }
        else{
            (allCommunities).forEach((comm) => {(comm.name.toLowerCase().trim() === name.toLowerCase().trim()) ? alertMsg += "*Community already exists*" : alertMsg += ""});
        }
        if(!description){
            alertMsg += "*Description cannot be blank*\n";
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
                members: [props.allData.user.displayName],
                creator: props.allData.user.displayName
            }
            resetInputs();
            if(props.allData.selectedItem === 'edit-community-button'){
                const updatedCommunity = {name: `${name}`, description: `${description}`}
                await axios.put(`http://127.0.0.1:8000/communities/${props.editingCommunity.id}`, updatedCommunity)
                const res1 = await axios.get(`http://127.0.0.1:8000/communities/${props.editingCommunity.id}`)
                const res2 = await axios.get("http://127.0.0.1:8000/communities")
                props.allUpdaters.updateCommunities(res2.data)
                props.allUpdaters.setSelectedItem(res1.data[0].url);
            }
            else{
                try{
                    await axios.post("http://127.0.0.1:8000/communities", newCommunity)
                    const res1 = await axios.get("http://127.0.0.1:8000/communities")
                    props.allUpdaters.updateCommunities(res1.data)
                    props.allUpdaters.setSelectedItem(res1.data[res1.data.length - 1].url);
                }
                catch(e){
                    handlePossibleBadAuthentication(e)
                }
            }
            
            props.allOpeners.openHomePage();
        }
    }

    return(
        <div id="create-community-view">
            <h1 id="create-community-view-title" className='h1-fixer'>{props.allData.selectedItem === "edit-community-button" ? `Editing '${props.editingCommunity.name}'` : "Create a New Community"}</h1>
            <form htmlFor="create-community-name" id="create-community-form">
                <div id="create-community-input-div">
                    <div className="community-input-container" id="community-name-container">
                        <label className="community-label" htmlFor="community-name">Community Name (required, max 100 characters):&nbsp;<span className="red-stars">*</span></label>
                        <input onChange={(e) => setName(e.target.value)} className="community-input-field" type="text" id="community-name" name="community-name" maxLength="100" placeholder="Community Name..." value={name} required />
                    </div>
                    <div className="community-input-container" id="community-description-container">
                        <label className="community-label" htmlFor="community-description">Community Description (required, max 500 characters):&nbsp;<span className="red-stars">*</span></label>
                        <textarea onChange={(e) => setDescription(e.target.value)} className="community-input-field" type="text" id="community-description" name="community-description" maxLength="500" placeholder="Description..." value={description} required></textarea>
                    </div>
                    <button id="engender-community-button" type="submit" onClick={engenderCommunity}>{props.allData.selectedItem === 'edit-community-button' ? "Confirm Edit" : "Engender Community"}</button>
                </div>
            </form>
        </div>
    );
};

export default CreateCommunityView;