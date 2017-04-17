/**
 * Created by jack on 16/11/2.
 */

let neo4j = require('neo4j-driver').v1;

exports.db47 = neo4j.driver("bolt://202.121.179.47", neo4j.auth.basic("neo4j", "123123")).session();

exports.db46 = neo4j.driver("bolt://202.121.179.46", neo4j.auth.basic("neo4j", "123123")).session();
