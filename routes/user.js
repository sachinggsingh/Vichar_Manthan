
const { Router } = require("express");
const User = require("../models/user");

const router = Router();


router.get("/signin", (req, res) => {
  try{
    return res.render("signin");
  }
  catch(err)
  {
    console.log(err);
    
    return res.status(500).send({message : err.message});
  }
});


router.get("/signup", (req, res) => {
 try{
  return res.render("signup");
 }
 catch(err)
 {
  console.log(err);
  return res.status(500).send({message : err.message});
 }
});



router.get("/profile",async (req,res)=>
{
  console.log(req.user);
  try
  {
      return res.render('profile',{
          user : req.user,
      });
  }
  catch(err)
  {
      console.log(err);
      return res.status(500).send({message : err.message});
  }
})


router.post("/signin", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    res.render("signin", { error: "Incorrect Email or Password" });
    // Pass the error to the next middleware
    next(error);  // Correctly use next() here for error propagation
  }
});




router.post("/signup", async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    await User.create({
      name,
      email,
      password,
    });

    return res.redirect("/");
  } catch (error) {
    res.render("signup", { error: "Error creating user" });
    next(error); 
  }
});


router.get("/logout", (req, res) => {
  // Clear the token cookie and redirect to the homepage
  res.clearCookie("token").redirect("/");
});

module.exports = router;
