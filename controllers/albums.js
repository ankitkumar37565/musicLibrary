const db = require('../models')
const models=db.models;
const Sequelize = require('sequelize');
const {v4:uuid} = require('uuid');
let response = require('../response')

class AlbumController {
    constructor(){}
    async getAlbums(req,res,next) {
        try {
            let {limit=10,offset=0,artist_id,hidden}=req.query;
            let where={};
            if(artist_id) {
                let artist = await models.Artist.findOne(
                    {
                        where:{
                            artist_id,
                        }
                    }
                )
                if(!artist) {
                    return response[404](res);
                }
                where.artist_id = artist_id;
            }
            
            if(hidden) {
                where.hidden = hidden;
            }
            let albums = await models.Album.findAll({
                include:[
                    {
                        model:models.Artist,
                        where:where,
                        as:'artist',
                        require:true,
                        attributes:[]
                    }
                ],
                attributes:['album_id',[Sequelize.col('artist.name'),'artist_name'],'name','year','hidden'],
                limit,
                offset,
                raw:true,
            });
            return res.status(200).json(
                {
                    "status": 200,
                    "data": albums,
                    "message": "Albums retrieved successfully.",
                    "error": null
                }
            )
        } catch (error) {
            next(error)
        }
    }
    async getAlbum(req,res,next) {
        try {
            let {id}=req.params;
            if(!id) {
                return response[400](res);
            }
            let albumFound = await models.Album.findOne({
                where:{
                    album_id:id,
                },
                include:[
                    {
                        model:models.Artist,
                        as:'artist',
                        require:true,
                        attributes:[]
                    }
                ],
                attributes:['album_id',[Sequelize.col('artist.name'),'artist_name'],'name','year','hidden'],
                raw:true,
            });
            if(!albumFound){
                return response[404](res);
            }
            return res.status(200).json(
                {
                    "status": 200,
                    "data": albumFound,
                    "message": "Album retrieved successfully.",
                    "error": null
                   }
            )
        } catch (error) {
            next(error)
        }
    }
    async addAlbum(req,res,next) {
        try {
            let {artist_id,name,year,hidden}=req.body;
            if(!artist_id) {
                return response[400](res);
            }
            let artist = await models.Artist.findOne(
                {
                    where:{
                        artist_id,
                    }
                }
            )
            if(!artist) {
                return response[404](res);
            }
            let album_id = uuid();
            let Album = await models.Album.create({
                album_id,artist_id,name,year,hidden,created_at:new Date()
            })
            return res.status(201).json(
                {
                    "status": 201,
                    "data": null,
                    "message": "Album created successfully.",
                    "error": null
                   }
            )
        } catch (error) {
            next(error)
        }
    }
    async updateAlbum(req,res,next) {
        try {
            let {id}=req.params;
            let {name,year,hidden}= req.body
            if(!id || (!name && !year && !hidden)) {
                return response[400](res);
            }
            let Album = await models.Album.findOne({
                where:{
                    album_id:id,
                },
                raw:true,
            })
            if(!Album) {
                return response[404](res);
            }
            await models.Album.update({name,year,hidden},{where:{album_id:id}})
            return res.status(204).json(
                {
                    "status": 204,
                    "data": null,
                    "message": "Album updated successfully",
                    "error": null
                   }
            )
        } catch (error) {
            next(error)
        }
    }
    async deleteAlbum(req,res,next) {
        try {
            let {id}=req.params;
            if(!id ) {
                return response[400](res);
            }
            let Album = await models.Album.findOne({
                where:{
                    album_id:id,
                },
                raw:true,
            })
            if(!Album) {
                return response[404](res);
            }
            await models.Album.destroy({where:{album_id:id}})
            return res.status(204).json(
                {
                    "status": 204,
                    "data": null,
                    "message": "Album deleted successfully.",
                    "error": null
                   }
            )
        } catch (error) {
            next(error)
        }
    }
}
module.exports= AlbumController;