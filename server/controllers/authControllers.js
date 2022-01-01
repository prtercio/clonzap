const pool = require("../db");
const bcrypt = require('bcrypt');

module.exports.handlelogin = (req, res) => {
    if(req.session.user && req.session.user.username){
        res.json({loggedIn: true, username: req.session.user.username});
      } else {
        res.json({ loggedIn: false});
      }
}

module.exports.attemptLogin = async (req, res) => {
        const potentialLogin = await pool.query(
            'SELECT id, username, passhash FROM users WHERE username=$1',
            [req.body.username]
        )
        if(potentialLogin.rowCount === 1){
        
            const isSamePass = await bcrypt
            .compare(req.body.password, potentialLogin.rows[0].passhash);
            if(isSamePass){
                req.session.user = {
                username: req.body.username,
                id: potentialLogin.rows[0].id
                };
                res.json({loggedIn:true, username:req.body.username})
            } else {
                res.json({loggedIn: false, status:"1 - Revise el nombre del usuario o la contraseña!"})
            }
            } else {
            console.log('----- Usuario no existe ------')
            res.json({loggedIn: false, status:"2 - Usuario no existe!"})
            }
       
    
}

module.exports.attemptRegister = async (req, res) => {
        //validateForm(req, res);
    
        const existingUser = await pool.query(
        "SELECT username from users WHERE username=$1", 
        [req.body.username]
        );
    
        if(existingUser.rowCount === 0){
            //register
            const hashedPass = await bcrypt.hash(req.body.password, 10);
        
            const newUserQuery = await pool.query(
                "INSERT INTO users(username, passhash) values ($1, $2) RETURNING id, username",
                [req.body.username, hashedPass]
        );
        
        req.session.user = {
            username: req.body.username,
            id: newUserQuery.rows[0].id
        };
        res.json({loggedIn:true, username:req.body.username})
        } else {
        
        res.json({loggedIn:false, status:"Usuario no existe"});
        }
   
}