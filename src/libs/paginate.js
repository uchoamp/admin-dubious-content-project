const Game = require("../models/Game");
const paginate = {};

paginate.paginate = async function (page, limit , query) {
    let games = {};

    if (query) {
        games = await Game.paginate({
            $or: [{ $text: { $search: `${query}` } }, {
                tittle
                    : { $regex: `${query}`, $options: "i" }
            }, {
                description
                    : { $regex: `${query}`, $options: "i" }
            }, {
                 type
                    : { $regex: `${query}`, $options: "i" }
            }, {
                tags
                    : { $regex: `${query}`, $options: "i" }
            }, {
                language
                    : { $regex: `${query}`, $options: "i" }
            }, {
                censorship
                    : { $regex: `${query}`, $options: "i" }
            }, {
                platform
                    : { $regex: `${query}`, $options: "i" }
            }]
        }, {
            limit: limit || 9, page: page || 1, sort: {score: { $meta: "textScore" }, createdAt: "desc" }
        });

    } else {
    games = await Game.paginate({}, { limit: limit || 9, page: page || 1, sort: { createdAt: "desc" } });
    }
  
    return { games: games.docs, totalPages: games.totalPages }
}

paginate.paginateCategory = async (page, limit, query)=>{

    const games = await Game.paginate(query, { limit: limit || 9, page: page || 1, collation:{locale: "pt", strength:1},sort: { createdAt: "desc" } });
    
    return { games: games.docs, totalPages: games.totalPages }
}

module.exports = paginate;