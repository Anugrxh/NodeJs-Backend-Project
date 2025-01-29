const {User} = require('../models/user')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken'); 

//geting all users


router.get('/',async(req,res)=>{
    try{
        const usersList = await User.find().select('-passwordHash')
        res.send(usersList)
    }
    catch(err){
        res.status(500).send({message:err.message})
        }
})

// getting single user


router.get('/:id',async(req,res)=>{
    try{
        const user = await User.findById(req.params.id).select('-passwordHash');
        res.send(user)
    }
    catch(err){
        res.status(500).send({message:err.message})
        }
})




//Adding users

router.post("/", async (req, res) => {
    try {
      let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        street: req.body.street, 
        apartment: req.body.apartment, 
        city: req.body.city, 
        zip: req.body.zip, 
        country: req.body.country, 
        phone: req.body.phone, 
        isAdmin: req.body.isAdmin, 
      });

      const savedUser = await user.save();
      res.send(savedUser);

    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating user", error: error.message });
    }
  });


router.post('/login', async (req, res) => {
    const user = await User.findOne({email:req.body.email})

    const secret = process.env.secret

    if (!user){
        return res.status(400).send({message: 'No userfound..'})
    }

    if(user && bcrypt.compareSync(req.body.password,user.passwordHash)){
        const token = jwt.sign(
            {
                userId : user.id,
                isAdmin : user.isAdmin,

            },
            secret,
            {expiresIn:'1d'}
            
        )
        res.status(200).send({user:user.email,token:token})
    } else {
        res.status(400).send({message: 'Wrong Password..'})
    }
   
});


router.delete("/:id", async (req, res) => {
    try {
      const deleteUser = await User.findByIdAndRemove(req.params.id);
      if (!deleteUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user", error: error.message });
    }
});
  
router.get("/get/count", async (req, res) => {
    try {
      const userCount = await User.countDocuments();
      res.status(200).send({ userCount });
    } catch (error) {
      res.status(500).json({ message: "Error counting users", error: error.message });
    }
});
  



module.exports = router;