const Space = require("../../models/space");
const User = require("../../models/user");
const UserSpace = require("../../models/userspace");

async function validCheck(userId, spaceId){
    try{
        const space = await Space.findOne(
            {
                where : {
                    id : spaceId
                }
            }
        );
        
        if(space == null) return false;

        const user = await User.findOne({
            where : {
                id : userId
            }
        });
        
        if(user == null) return false;

        const role = await UserSpace.findOne(
            {
                where : {
                    userId : userId,
                    spaceId : spaceId
                }
            }
        );

        if(role == null) return false;

        if(role.role == "admin" || role.role == "owner" || role.role == "participant") return true;
        else return true;
    }
    catch (e){
        console.log(e);
        return false;
    }
}

module.exports = {validCheck};