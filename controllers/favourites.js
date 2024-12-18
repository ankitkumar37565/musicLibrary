const db = require('../models')
const models=db.models;
const Sequelize = require('sequelize');
const {v4:uuid} = require('uuid');
let response = require('../response')

class FavoritesController {
    constructor(){}
    async getFavorites(req,res,next) {
        try {
            let {category} = req.params
            let {limit=10,offset=0}=req.query;
            let categories=['track','artist','album']
            if(!categories.includes(category) ) {
                return response[400](res);
            }
            let query = `
            SELECT 
            F.favorite_id,
            F.category,
            F.item_id,
            CASE
                WHEN F.category = 'track' THEN (SELECT name from public."Track" WHERE track_id=F.item_id)
                WHEN F.category = 'artist' THEN (SELECT name from public."Artist" WHERE artist_id=F.item_id)
                WHEN F.category = 'album' THEN (SELECT name from public."Album" WHERE album_id=F.item_id)
                ELSE NULL
            END AS name,
            F.created_at
            FROM public."Favorites" F
            WHERE F.category = :category AND F.user_id = :user_id
            LIMIT :limit OFFSET :offset
            `;
            const favorites = await db.sequelize.query(query,{
                replacements:{category,user_id:req.user.user_id,limit,offset},
                type:Sequelize.QueryTypes.SELECT,
            });
            
            return res.status(200).json(
                {
                    "status": 200,
                    "data": favorites,
                    "message": "Favorites retrieved successfully.",
                    "error": null
                }
            )
        } catch (error) {
            next(error)
        }
    }
    async addFavorite(req,res,next) {
        try {
            let {category,item_id}=req.body;
            if(!category || !item_id ) {
                return response[400](res);
            }
            let model;
            let idName;
            switch (category) {
                case 'track': {
                    model = models.Track ;
                    idName = 'track_id';
                    break;
                }
                case 'artist': {
                    model = models.Artist ;
                    idName = 'artist_id';
                    break;
                }
                case 'album': {
                    model = models.Album ;
                    idName = 'album_id';
                    break;
                }
            }
            if(!model) {
                return response[400](res);
            }
            let where ={}
            where[idName]=item_id;
            let item = await model.findOne(
                {
                    where:where,
                    raw:true,
                }
            );
            if(!item ) {
                return response[404](res);
            }
            let favorite_id = uuid();
            let Favorites = await models.Favorites.create({
                favorite_id,item_id,category,created_at:new Date(),user_id:req.user.user_id,
            })
            return res.status(201).json(
                {
                    "status": 201,
                    "data": null,
                    "message": "Favorites added successfully.",
                    "error": null
                   }
            )
        } catch (error) {
            next(error)
        }
    }
    async updateFavorites(req,res,next) {
        try {
            let {id}=req.params;
            let {name,duration,hidden}= req.body
            if(!id || (!name && !duration && !hidden)) {
                return response[400](res);
            }
            let Favorites = await models.Favorites.findOne({
                where:{
                    favorites_id:id,user_id:req.user.user_id,
                },
                raw:true,
            })
            if(!Favorites) {
                return response[404](res);
            }
            await models.Favorites.update({name,duration,hidden},{where:{favorites_id:id}})
            return res.status(204).json(
                {
                    "status": 204,
                    "data": null,
                    "message": "Favorites updated successfully",
                    "error": null
                   }
            )
        } catch (error) {
            next(error)
        }
    }
    async removeFavorite(req,res,next) {
        try {
            let {id}=req.params;
            if(!id ) {
                return response[400](res);
            }
            let query = `
            SELECT 
            CASE
                WHEN F.category = 'track' THEN (SELECT name from public."Track" WHERE track_id=F.item_id)
                WHEN F.category = 'artist' THEN (SELECT name from public."Artist" WHERE artist_id=F.item_id)
                WHEN F.category = 'album' THEN (SELECT name from public."Album" WHERE album_id=F.item_id)
                ELSE NULL
            END AS name
            FROM public."Favorites" F
            WHERE F.favorite_id = :id AND F.user_id = :user_id
            `;
            const favorite = await db.sequelize.query(query,{
                replacements:{id,user_id:req.user.user_id},
                type:Sequelize.QueryTypes.SELECT,
            });
            if(!favorite?.[0]) {
                return response[404](res);
            }
            await models.Favorites.destroy({where:{favorite_id:id}})
            return res.status(200).json(
                {
                    "status": 200,
                    "data": null,
                    "message": `Favorites:${favorite[0].name} deleted successfully.`,
                    "error": null
                }
            )
        } catch (error) {
            next(error)
        }
    }
}
module.exports= FavoritesController;