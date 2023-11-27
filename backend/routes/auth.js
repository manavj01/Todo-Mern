const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
// SignUp

router.post("/signUp", async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const hashpassowrd = bcrypt.hashSync(password);
        const user = new User({ email, username, password: hashpassowrd });
        await user.save()
            .then(
                () => {
                    res.status(200)
                        .json({ user: user });
                })
    } catch (error) {
        res.status(200)
            .json({ "message": "user already exist" });
    }
})


// signIn

router.post("/signIn", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            res.status(400).json({ message: "Please sign up first" });
        }

        const isPasswordCorrect = bcrypt.compareSync(
            req.body.password, user.password
        );

        if(!isPasswordCorrect){
            res.status(400).json({message: "Password is Incorrect"});
        }

        const {password, ...userWithoutPassword} = user._doc;

        res.status(200).json({userWithoutPassword});
    } catch (error) {
        res.status(400).json({ message: "Login Credentials does not match - try again" })
    }
})


module.exports = router;