const User = require("../models/user_model");
const request = require('request').defaults({ rejectUnauthorized: false });

const url = "https://labs.megaproject.live/api/public/request_kasm";
const delLaburl = "https://labs.megaproject.live/api/public/destroy_kasm";
const logouturl = "https://labs.megaproject.live/api/public/logout_user";

async function getLab(req, res){

    const user = await User.findById(req.user._id).select({lab_id:1});
    const lab_id = user.lab_id
    const payload = {
        json: {
            "api_key":"JaBVHCaK66vS",
            "api_key_secret":"EZBdLV0zVBUXkDfUhn4DqyEy8HwQhdiQ",
            "user_id": lab_id,
            "image_id": "2f3af5a31f994e609e4ad197a3f0902b",
            "enable_sharing": false
        }
    }
    
    console.log("Thos is lab id",lab_id);
    request.post(url, payload, (err, response, body)=>{
        if(!err){
            console.log("response code", response.statusCode);
            console.log("this is body  : ",body);
            res.status(response.statusCode).send(body)

        }
    });

}

async function delLab(req, res){

    const payload = {
        json: {
            "api_key":"JaBVHCaK66vS",
            "api_key_secret":"EZBdLV0zVBUXkDfUhn4DqyEy8HwQhdiQ",
            'kasm_id': req.body.kasm_id,
            "user_id": req.body.user_id,
        }
    }

    const payload2 = {
        json: {
            "api_key":"JaBVHCaK66vS",
            "api_key_secret":"EZBdLV0zVBUXkDfUhn4DqyEy8HwQhdiQ",
            "target_user": {
                "user_id": req.body.user_id
            }
        }
    }
    request.post(delLaburl, payload, (err, response, body)=>{
        if(!err){
            request.post(logouturl, payload2, (err2, response2, body2)=>{
                if(!err2){
                    // res.status(response2.statusCode).send("Successfull logout")
                }
            })
            res.status(response.statusCode).send("Successfull deleted")
        }
    })

}

module.exports = {
    getLab,
    delLab
}