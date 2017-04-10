/**
 * Created by jack on 16/11/2.
 */

let neo4j = require('neo4j-driver').v1;

module.exports = neo4j.driver("bolt://202.121.179.47", neo4j.auth.basic("neo4j", "123123")).session();
