const { fetchUsers } = require("../models/usersModel");

exports.getUsers = async (err, req, res, next) => {
console.log("Drizzy")


try{
    const users = await fetchUsers()
    
}catch(err){}
}
