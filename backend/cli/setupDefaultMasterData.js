const scanf = require('scanf');
require('dotenv').config();

var shajs = require('sha.js');

const DBHandler = require('../lib/database');
const log = require('../lib/logger.js')();
const utils = require('../lib/utils');
const constants = require('../lib/const');

(async() => {

    const defaultStatus = ["unspecified"];

    const defaultType = [
        "laptop", 
        "desktop", 
        "phone", 
        "camera", 
        "gimbal", 
        "printer", 
        "screen", 
        "keyboard", 
        "microphone", 
        "charger", 
        "accessory"
    ];

    const collectionName = 'master';

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

    await Promise.all( defaultType.map( async item => {

        const existance = await dbClient
            .collection(collectionName)
            .find({
                type:constants.MasterTypeType,
                value:item
            }).toArray();

        if(existance.length != 0){
            return console.log(item + " is already exists");
        }

        const insertResult = await dbClient.collection(collectionName).insertOne({
            type:constants.MasterTypeType,
            value:item,
            created:utils.now()
        });

        if(insertResult.insertedCount == 1){
            logger.info("Succeed to insert " + item);
        }else {
            logger.error("Failed to insert " + item);
        }

    }));

    await Promise.all( defaultStatus.map( async item => {

        const existance = await dbClient
            .collection(collectionName)
            .find({
                type:constants.MasterTypeStatus,
                value:item
            }).toArray();

        if(existance.length != 0){
            return console.log(item + " is already exists");
        }

        const insertResult = await dbClient.collection(collectionName).insertOne({
            type:constants.MasterTypeStatus,
            value:item,
            created:utils.now()
        });

        if(insertResult.insertedCount == 1){
            logger.info("Succeed to insert " + item);
        }else {
            logger.error("Failed to insert " + item);
        }

    }));


    process.exit(0);

})();


