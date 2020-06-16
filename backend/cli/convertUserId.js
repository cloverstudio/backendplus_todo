const scanf = require('scanf');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectID;

var shajs = require('sha.js');

const DBHandler = require('../lib/database');
const log = require('../lib/logger.js')();
const utils = require('../lib/utils');

(async() => {

    const collectionName = 'equipment';

    const DB = new DBHandler({
        url:process.env.mongodbConnection,
        database:process.env.mongodbDBName
    });

    const logger = log.startLogger({
        filepath: null,
        file: null,
        level: "debug",
        console: true
    });

    logger.info('Connecting to DB...')

    await DB.setup();

    logger.info('Connected to DB !');

    const dbClient = DB.getDB();

    const equipments = await dbClient.collection(collectionName).find({}).toArray();
    
    for(let i = 0 ; i < equipments.length ; i++){

        const equipment = equipments[i];

        const checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");

        if(equipment.userId && checkForHexRegExp.test(equipment.userId) ){

            const updateResult = await dbClient.collection(collectionName).updateOne({
                _id:equipment._id
            }, {$set: {
                userId:new ObjectId(equipment.userId)
            }});
    
            logger.info(equipment._id + " updated !");

        }

    }

    process.exit(0);

})();


