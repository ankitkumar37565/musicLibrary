const db = require('../models')
const models=db.models;
const Sequelize = require('sequelize');
const {v4:uuid} = require('uuid');
let response = require('../response')

class TrackController {
    constructor(){}
    async getTracks(req,res,next) {
        try {
            let {limit=10,offset=0,artist_id,album_id,hidden}=req.query;
            let where={};
            if(artist_id) {

                let artist = await models.Artist.findOne(
                    {
                        where:{
                            artist_id,
                        }
                    }
                )
                if(!artist ) {
                    return response[404](res);
                }
                where.artist_id = artist_id;
            }
            if(album_id) {

                let album = await models.Album.findOne(
                    {
                        where:{
                            album_id,
                        }
                    }
                )
                if(!album) {
                    return response[404](res);
                }
                where.album_id = album_id;
            } 
            
            if(hidden) {
                where.hidden = hidden;
            }
            let tracks = await models.Track.findAll({
                where:where,
                include:[
                    {
                        model:models.Artist,
                        as:'artist',
                        attributes:[]
                    },
                    {
                        model:models.Album,
                        as:'album',
                        attributes:[]
                    }
                ],
                attributes:[
                    'track_id',
                    [Sequelize.literal('artist.name'),'artist_name'],
                    [Sequelize.literal('album.name'),'album_name'],
                    'name',
                    'duration',
                    'hidden',
                ],
                limit,
                offset,
                raw:true,
            });
            return res.status(200).json(
                {
                    "status": 200,
                    "data": tracks,
                    "message": "Tracks retrieved successfully.",
                    "error": null
                }
            )
        } catch (error) {
            next(error)
        }
    }
    async getTrack(req,res,next) {
        try {
            let {id}=req.params;
            if(!id) {
                return response[400](res);
            }
            let trackFound = await models.Track.findOne({
                where:{
                    track_id:id,
                },
                include:[
                    {
                        model:models.Artist,
                        as:'artist',
                        attributes:[]
                    },
                    {
                        model:models.Album,
                        as:'album',
                        attributes:[]
                    }
                ],
                attributes:[
                    'track_id',
                    [Sequelize.literal('artist.name'),'artist_name'],
                    [Sequelize.literal('album.name'),'album_name'],
                    'name',
                    'duration',
                    'hidden',
                ],
                raw:true,
            });
            if(!trackFound){
                return response[404](res);
            }
            return res.status(200).json(
                {
                    "status": 200,
                    "data": trackFound,
                    "message": "Track retrieved successfully.",
                    "error": null
                   }
            )
        } catch (error) {
            next(error)
        }
    }
    async addTrack(req,res,next) {
        try {
            let {artist_id,album_id,name,duration,hidden}=req.body;
            if(!artist_id || !album_id || !name) {
                return response[400](res);
            }
            let artist = await models.Artist.findOne(
                {
                    where:{
                        artist_id,
                    }
                }
            )
            let album = await models.Album.findOne(
                {
                    where:{
                        album_id,
                    }
                }
            )
            if(!artist || !album) {
                return response[404](res);
            }
            let track_id = uuid();
            let Track = await models.Track.create({
                track_id,artist_id,album_id,name,duration,hidden,created_at:new Date()
            })
            return res.status(201).json(
                {
                    "status": 201,
                    "data": null,
                    "message": "Track created successfully.",
                    "error": null
                   }
            )
        } catch (error) {
            next(error)
        }
    }
    async updateTrack(req,res,next) {
        try {
            let {id}=req.params;
            let {name,duration,hidden}= req.body
            if(!id || (!name && !duration && !hidden)) {
                return response[400](res);
            }
            let Track = await models.Track.findOne({
                where:{
                    track_id:id,
                },
                raw:true,
            })
            if(!Track) {
                return response[404](res);
            }
            await models.Track.update({name,duration,hidden},{where:{track_id:id}})
            return res.status(204).json(
                {
                    "status": 204,
                    "data": null,
                    "message": "Track updated successfully",
                    "error": null
                   }
            )
        } catch (error) {
            next(error)
        }
    }
    async deleteTrack(req,res,next) {
        try {
            let {id}=req.params;
            if(!id ) {
                return response[400](res);
            }
            let Track = await models.Track.findOne({
                where:{
                    track_id:id,
                },
                raw:true,
            })
            if(!Track) {
                return response[404](res);
            }
            await models.Track.destroy({where:{track_id:id}})
            return res.status(200).json(
                {
                    "status": 200,
                    "data": null,
                    "message": `Track:${Track.name} deleted successfully.`,
                    "error": null
                }
            )
        } catch (error) {
            next(error)
        }
    }
}
module.exports= TrackController;