const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

//Get all Users
router.get('/', usersController.getAllUsers);

//Create a User
router.post('/', usersController.createUser);

//Get User by ID
router.get('/:userID', usersController.getUserByID);

//Update a User
router.put('/:userID', usersController.updateUser);

//Delete a User
router.delete('/:userID', usersController.deleteUser);

//*After CRUD operations*
//Get User by displayName
router.get('/displayName/:displayName', usersController.getUserByDisplayName);

//Get User by email
router.get('/email/:email', usersController.getUserByEmail);

//guest user
router.post('/guest', usersController.guestUser)

//Login
router.post('/login', usersController.loginUser);



//GOOFY
router.get('/profile/profile', usersController.getProfile)







//OLD LOGIN STUFF
//Attempt to log-in user
// router.post('/comparepassword/:userID', async (req, res) => {
//     try{
//         const plaintextPassword = req.body.password;
//         const user = await User.findById(req.params.userID);

//         if(!user){
//             res.status(404).send({error: "User not found"});
//             return;
//         }

//         const isMatch = await bcrypt.compare(plaintextPassword, user.password);

//         if(!isMatch){
//             res.status(404).send({error: "Wrong password"});
//             return;
//         }
//         const token = jwt.sign({userID: user._id}, process.env.JWT_SECRET);

//         res.cookie("token", token, {
//             httpOnly: true, secure: true, sameSite: "none"}).status(200).json({
//                 success: true,
//                 user: {
//                     displayName: user.displayName,
//                     email: user.email
//                 }
//             }).send();
//     }
//     catch(e){
//         res.status(500).send({ error: "Logging in User failed." });
//     }
// })

module.exports = router;