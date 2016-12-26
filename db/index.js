/**
 * Created by jack on 16/11/2.
 */

let neo4j = require('neo4j-driver').v1;
let config = require('../config');

// module.exports = neo4j.driver("bolt://116.228.198.27", neo4j.auth.basic("neo4j", "123123")).session();
module.exports = neo4j.driver("bolt://202.121.179.53", neo4j.auth.basic("neo4j", "123123")).session();
