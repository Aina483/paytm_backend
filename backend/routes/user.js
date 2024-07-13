const express=require('express');
const router=express.Router();
const zod=require('zod');
const jwt=require('jsonwebtoken');
const {User, Accounts}=require('../db')
const {JWT_TOKEN}=require('../config');
const  { authMiddleware } = require("../middleware");

const signupSchema=zod.object({
    username:zod.string(),
    password:zod.string(),
    firstName:zod.string(),
    lastName:zod.string()
})

//sign up route and signin route
router.post('/signup', async(req,res)=>{
    const body=req.body;
    const {success}=signupSchema.safeParse(body);

    if(!success){
        return res.json({
            message:"Incorrect inputs"
        })
    }

    const user=User.findOne({
        username:req.body.username
    })

    if(user._id){
        return res.json({
            message:"Email already exist"
        })
    }

    const dbUser=await User.create(body);

    

    const userId = user._id;

		/// ----- Create new account ------

    await Accounts.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    const token=jwt.sign({
        userId:user._id
    }, JWT_TOKEN)
    res.json({
        message:"User created successfully",
        token:token
    })



})

//input validation for sign in 
const signinSchema=zod.object({
    username:zod.string,
    password:zod.string
})
router.post('/signin', async(req,res)=>{
      const body=req.body;
      const {success}=signinSchema.safeParse(body);
      if(!success){
        return res.json({
            message:"wrong input"
        })
      }

      const user=User.findOne({
        username:req.body.username,
        password:req.body.password
      })

      if(user){
        const token=jwt.sign({
           userID:user._id
        }, JWT_TOKEN)
      
      res.json({
        token:token
      })
    }

})

//to update user info, most commonly it will be used in profile section to update 
//or change password, firstName, lastname



// other auth routes
// schema for input validation of updatig the details
const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})
// used the authorized middleware, such that only people who have loged in will have the access to update the details , no other person can access the route
router.put("/updatedetails", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

		await User.updateOne({ _id: req.userId }, req.body);
	
    res.json({
        message: "Updated successfully"
    })
})

//route to get the users from the backend, like friends to receive money
//get request- to get the users from backend
//the query parameter will be /api/v1/users/bulk?filter=something
router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports=router;