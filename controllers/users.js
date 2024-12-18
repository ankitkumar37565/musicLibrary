const db = require('../models')
const models=db.models;
const Sequelize = require('sequelize')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {v4:uuid} = require('uuid');
let response = require('../response');
class UserController {
    constructor(){}
    async logout(req,res,next) {
        try {
            return res.status(200).json(
                {
                    "status": 200,
                    "data": null,
                    "message": "User logged out successfully.",
                    "error": null
                   }
            )
        } catch (error) {
            next(error)
        }
    }
    async signup(req,res,next) {
        try {
            let {email,password,role}=req.body;
            if(!email || !password) {
                return response[400](res);
            }
            let emailAlreadyExist = await models.User.findOne({
                where:{
                    email,
                },
                raw:true,
            });
            if(emailAlreadyExist){
                return res.status(409).json(
                    {
                        "status": 409,
                        "data": null,
                        "message": "Email already exists.",
                        "error": null
                       }
                )
            }
            let firstUserCreated = await models.User.findAll({
                limit:1,
                raw:true,
            })
            if(!firstUserCreated.length) {
                role= 'Admin';
            }
            if(firstUserCreated && role === 'Admin') {
                return response[400](res);
            }
            let user_id= uuid();
            password = await bcrypt.hash(password,10);
            let user = await models.User.create(
                {user_id,email,password,role,created_at:new Date()}
            );
            return res.status(201).json(
                {
                    "status": 201,
                    "data": null,
                    "message": "User created successfully.",
                    "error": null
                   }
            )
        } catch (error) {
            next(error)
        }
    }
    async login(req,res,next) {
        try {
            let {email,password}=req.body;
            if(!email || !password) {
                return response[400](res);
            }
            let userFound = await models.User.findOne({
                where:{
                    email,
                },
                raw:true,
                attributes:['user_id','role','password']
            });
            if(!userFound){
                return response[404](res);
            }
            let passwordMatch= await bcrypt.compare(password,userFound.password);
            if(!passwordMatch) {
                return response[400](res);
            }
            else {
                let jwtToken = jwt.sign({user_id:userFound.user_id,role:userFound.role},process.env.JWT_SECRET,{expiresIn:'15m'});
                return res.status(200).json(
                    {
                        "status": 200,
                        "data": {
                        "token": 'Bearer '+jwtToken,
                        },
                        "message": "Login successful.",
                        "error": null
                       }
                       
                )
            }
        } catch (error) {
            next(error)
        }
    }
    async getUsers(req,res,next) {
        try {
            let {limit=10,offset=0,role}=req.query;
            let where={admin_id:req.user.user_id}
            if(role){
                where.role = role
            }
            let users = await models.User.findAll({
                where:where,
                attributes:{exclude:['password']},
                limit:limit,
                offset:offset,
            })
            return res.status(200).json(
                {
                    "status": 200,
                    "data": users,
                    "message": "Users retrieved successfully.",
                    "error": null
                   }
            )
        } catch (error) {
            next(error)
        }
    }
    async addUser(req,res,next) {
        try {
            let {email,password,role}=req.body;
            let emailAlreadyExist = await models.User.findOne({
                where:{
                    email,
                }
            })
            if(emailAlreadyExist){
                return res.status(409).json(
                    {
                        "status": 409,
                        "data": null,
                        "message": "Email already exists.",
                        "error": null
                       }
                )
            }
            if (role === 'Admin') {
                return response[400](res);
            }
            let user_id = uuid()
            password= await bcrypt.hash(password,10);
            let user= await models.User.create({
                user_id,email,password,role,created_at:new Date(),admin_id:req.user.user_id,
            })
            return res.status(201).json(
                {
                    "status": 201,
                    "data": null,
                    "message": "User created successfully.",
                    "error": null
                   }
            )
        } catch (error) {
            next(error)
        }
    }
    async deleteUsers(req,res,next) {
        try {
            let {id}=req.params;
            if(id===':id') {
                return response[400](res);
            }
            let user = await models.User.findOne({
                where:{
                    user_id:id,
                },
                raw:true,
            })
            if(!user){
                return response[404](res);
            }
            if(user.role==='Admin'){
                return response[400](res);
            }
            await models.User.destroy({
                where:{
                    user_id:id
                }
            })
            return res.status(201).json(
                {
                    "status": 200,
                    "data": null,
                    "message": "User deleted successfully.",
                    "error": null
                   }
            )
        } catch (error) {
            next(error)
        }
    }
    async updatePassword(req,res,next) {
        try {
            let {old_password,new_password}=req.body;
            let user = await models.User.findOne({
                where:{
                    user_id:req.user.user_id,
                },
                raw:true,
            })
            if(!user){
                return response[404](res);
            }
            if(user.role==='Admin'){
                return response[400](res);
            }
            let compare = old_password?await bcrypt.compare(old_password,user.password):false;
            if(!old_password || !new_password || old_password=== new_password || !compare) {
                return response[400](res);
            } 
            new_password = await bcrypt.hash(new_password,10);
            await models.User.update({
                password:new_password,
            },{
                where:{
                    user_id:req.user.user_id,
                }
            });
            return res.status(204).send();
        } catch (error) {
            next(error)
        }
    }
}
module.exports= UserController;