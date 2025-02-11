var jwt = require('jsonwebtoken')
var mailer = require('../emailer/emailer')
const User = require("../../models/user.model")
const secret = 'secret'

const emailCheck = async (email, req, res, next) =>{ //For now use EMAIL so we check if that is in the database
    let token;
    try{
        const id = await User.findById(email) //Will this work? How can we find the user without an id
        if (!id){ //if user's email isn't in the database
            try{
                const payload = { //Tokens MUST have at least the user's email and confirmed representing if they've signed in before or not!!
                    email: email,
                    confirmed: false 
                }
                const options = {
                    expiresIn: '1h'
                }
                const token = jwt.sign(payload, secret, options)
                //Send confirmation email with link to verify 
                var link = 'https://yourapp.com/login/authorize?token=<'+token+'>' //TODO: the actual link to the confirm webpage!!
                await mailer.sendEmail(email,'authentication',link); //login.routes will wait for this link to be clicked
            }
            catch(error){
                console.error(error)
                return { message: error}
            }

        }

        else{ //If the user is returning
            const payload = {
                email: email,
                confirmed: true
            }
            const options = {
                expiresIn: '7d'
            }
            const token = jwt.sign(payload, secret, options)

            //TODO: have a link that actually redirects the user
            var link = 'https://yourapp.com/login/authorize?token=<'+token+'>'
            await mailer.sendEmail(email,'authentication',link)
        }
    
    
    next();
    }
    catch (error){
        console.error(error)
        return { message: error} 
    }
}