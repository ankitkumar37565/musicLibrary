const db = require('../models')
const models=db.models;
const Sequelize = require('sequelize');
const {v4:uuid} = require('uuid');
let response = require('../response')

class ArtistController {
    constructor(){}
    async artists(req,res,next) {
        try {
            let {limit=10,offset=0,grammy,hidden}=req.query;
            let where={};
            if(grammy) {
                where.grammy = grammy;
            }
            if(hidden) {
                where.hidden = hidden;
            }
            let artists = await models.Artist.findAll({
                where:where,
                limit,
                offset,
                raw:true,
            });
            return res.status(200).json(
                {
                    "status": 200,
                    "data": artists,
                    "message": "Artists retrieved successfully.",
                    "error": null
                   }
            )
        } catch (error) {
            next(error)
        }
    }
    async getArtist(req,res,next) {
        try {
            let {id}=req.params;
            if(!id) {
                return response[400](res);
            }
            let artistFound = await models.Artist.findOne({
                where:{
                    artist_id:id,
                },
                raw:true,
            });
            if(!artistFound){
                return response[404](res);
            }
            return res.status(200).json(
                {
                    "status": 200,
                    "data": artistFound,
                    "message": "Artist retrieved successfully.",
                    "error": null
                   }
            )
        } catch (error) {
            next(error)
        }
    }
    async addArtist(req,res,next) {
        try {
            let {name,grammy,hidden}=req.body;
            let artist_id = uuid();
            let artist = await models.Artist.create({
                artist_id,name,grammy,hidden,created_at:new Date()
            })
            return res.status(201).json(
                {
                    "status": 201,
                    "data": null,
                    "message": "Artist created successfully.",
                    "error": null
                   }
            )
        } catch (error) {
            next(error)
        }
    }
    async updateArtist(req,res,next) {
        try {
            let {id}=req.params;
            let {name,grammy,hidden}= req.body
            if(!id || (!name && !grammy && !hidden)) {
                return response[400](res);
            }
            let artist = await models.Artist.findOne({
                where:{
                    artist_id:id,
                },
                raw:true,
            })
            if(!artist) {
                return response[404](res);
            }
            await models.Artist.update({name,grammy,hidden},{where:{artist_id:id}})
            return res.status(204).json(
                {
                    "status": 204,
                    "data": null,
                    "message": "Artist updated successfully",
                    "error": null
                   }
            )
        } catch (error) {
            next(error)
        }
    }
    async deleteArtist(req,res,next) {
        try {
            let {id}=req.params;
            if(!id ) {
                return response[400](res);
            }
            let artist = await models.Artist.findOne({
                where:{
                    artist_id:id,
                },
                raw:true,
            })
            if(!artist) {
                return response[404](res);
            }
            await models.Artist.destroy({where:{artist_id:id}})
            return res.status(200).json(
                {
                    "status": 204,
                    "data": null,
                    "message": "Artist deleted successfully.",
                    "error": null
                   }
            )
        } catch (error) {
            next(error)
        }
    }
}
module.exports= ArtistController;