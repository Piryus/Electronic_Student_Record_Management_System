'use strict';

const mongoose = require('mongoose');

const students = [
    {"_id":"5dca711c89bf46419cf5d483","ssn":"MDFGKO06L02F082G","name":"Marco","surname":"Cremonesi","grades":[{"date": "2019-10-16T07:58:00.000Z","_id":"5dca868936963d4b6ccb47a9","value":5,"subject":"Art"}],"__v":0,"classId":"5dc9c3112d698031f441e1c9"},
    {"_id":"5dca711c89bf46419cf5d484","ssn":"FCEEHG02B04N054D","name":"Luca","surname":"Longo","grades":[{"date": "2019-02-13T07:30:00.000Z","_id":"5dca86b02a65bd4eb0524e77","value":3,"subject":"English"},{"date": "2019-12-03T09:14:00.000Z","_id":"5dca86b02a65bd4eb0524e76","value":9.75,"subject":"Science"}],"__v":0,"classId":"5dc9c3112d698031f441e1c9"},
    {"_id":"5dca711c89bf46419cf5d485","ssn":"JPCOME07O02C034H","name":"Alice","surname":"Capon","grades":[{"date": "2019-04-08T07:57:00.000Z","_id":"5dca86cf8121cd05fc35a4a3","value":6,"subject":"Latin"},{"date": "2019-06-23T11:50:00.000Z","_id":"5dca86cf8121cd05fc35a4a2","value":6.5,"subject":"English"},{"date": "2019-12-14T12:49:00.000Z","_id":"5dca86cf8121cd05fc35a4a1","value":8.75,"subject":"Art"},{"date": "2019-12-30T11:27:00.000Z","_id":"5dca86cf8121cd05fc35a4a0","value":7,"subject":"Science"}],"__v":0,"classId":"5dc9c3112d698031f441e1c9"},
    {"_id":"5dca711c89bf46419cf5d486","ssn":"JLMLBH00B07K064G","name":"Alessio","surname":"Mazzi","grades":[{"date": "2019-05-13T06:22:00.000Z","_id":"5dca86efda1a64444022fc1f","value":4.25,"subject":"English"},{"date": "2019-09-26T10:03:00.000Z","_id":"5dca86efda1a64444022fc1e","value":3,"subject":"Science"},{"date": "2019-03-06T11:48:00.000Z","_id":"5dca86efda1a64444022fc1d","value":6.25,"subject":"Religion"},{"date": "2019-07-09T11:21:00.000Z","_id":"5dca86efda1a64444022fc1c","value":5.75,"subject":"History"}],"__v":0,"classId":"5dc9c3112d698031f441e1c9"},
    {"_id":"5dca711c89bf46419cf5d487","ssn":"CCJNJM09K01P046D","name":"Maria","surname":"Palermo","grades":[{"date": "2019-06-23T08:08:00.000Z","_id":"5dca870d988b3b2ecce682cb","value":4.75,"subject":"Gym"}],"__v":0,"classId":"5dc9c3112d698031f441e1c9"},
    {"_id":"5dca711c89bf46419cf5d488","ssn":"LMNNML01B05F051C","name":"Silvia","surname":"Ferrari","grades":[],"__v":0,"classId":"5dc9c3112d698031f441e1c9"},
    {"_id":"5dca711c89bf46419cf5d489","ssn":"MGOAAP05I08P020M","name":"Enzo","surname":"Cremonesi","grades":[{"date": "2019-03-26T07:55:00.000Z","_id":"5dca873051a8e401cc6ad963","value":4.75,"subject":"Math"},{"date": "2019-10-23T08:15:00.000Z","_id":"5dca873051a8e401cc6ad962","value":4.5,"subject":"English"}],"__v":0,"classId":"5dc9c3112d698031f441e1c9"},
    {"_id":"5dca711c89bf46419cf5d48a","ssn":"NAMAKH06I03P070A","name":"Francesca","surname":"Trentino","grades":[{"date": "2019-01-25T09:00:00.000Z","_id":"5dca8588c1fac23a3c0540bf","value":8.5,"subject":"English"}],"__v":0,"classId":"5dc9c3112d698031f441e1c9"},
    {"_id":"5dca711c89bf46419cf5d48b","ssn":"OJCHFE07F05M064L","name":"Myriam","surname":"Manfrino","grades":[{"date": "2019-01-10T10:55:00.000Z","_id":"5dca85abfa7ffb054c340a2d","value":3.75,"subject":"Science"},{"date": "2019-12-12T11:19:00.000Z","_id":"5dca85abfa7ffb054c340a2c","value":5.75,"subject":"Religion"}],"__v":0,"classId":"5dc9c3112d698031f441e1c9"},
    {"_id":"5dca711c89bf46419cf5d48c","ssn":"IFHMHK01L07L058D","name":"Giacomo","surname":"Lori","grades":[{"date": "2019-03-27T07:09:00.000Z","_id":"5dca85ccd2c72a240c36364b","value":4,"subject":"Physics"},{"date": "2019-06-30T06:24:00.000Z","_id":"5dca85ccd2c72a240c36364a","value":8,"subject":"Math"},{"date": "2019-03-30T10:02:00.000Z","_id":"5dca85ccd2c72a240c363649","value":7,"subject":"Physics"},{"date": "2019-11-24T10:39:00.000Z","_id":"5dca85ccd2c72a240c363648","value":3.5,"subject":"Physics"}],"__v":0,"classId":"5dc9c3112d698031f441e1c9"},
    {"_id":"5dca711c89bf46419cf5d48d","ssn":"KDKNJL01L05F034A","name":"Paolo","surname":"Pirozzi","grades":[{"date": "2019-12-10T07:49:00.000Z","_id":"5dca85f431932504fcc8ebf0","value":5.5,"subject":"Physics"}],"__v":0,"classId":"5dc9c3112d698031f441e1c9"},
    {"_id":"5dca711c89bf46419cf5d48e","ssn":"PBFNDJ01E04O002B","name":"Anna","surname":"Bianchi","grades":[{"date": "2019-12-23T08:15:00.000Z","_id":"5dca86583c93b34974e2186f","value":8.5,"subject":"Art"},{"date": "2019-08-11T06:09:00.000Z","_id":"5dca86583c93b34974e2186e","value":7.75,"subject":"Gym"},{"date": "2019-02-02T10:20:00.000Z","_id":"5dca86583c93b34974e2186d","value":6.5,"subject":"History"},{"date": "2019-03-25T12:01:00.000Z","_id":"5dca86583c93b34974e2186c","value":4.25,"subject":"Gym"}],"__v":0,"classId":"5dc9c3112d698031f441e1c9"},
    {"_id":"5dca711c89bf46419cf5d48f","ssn":"AKFKCL03M05K075K","name":"Geremia","surname":"Costa","grades":[],"__v":0,"classId":"5dc9c3112d698031f441e1c9"},
    {"_id":"5dca711c89bf46419cf5d490","ssn":"GPNCID08N09N089B","name":"Riccardo","surname":"Cocci","grades":[{"date": "2019-11-13T11:55:00.000Z","_id":"5dca8759ba7eab125cef39e7","value":3.75,"subject":"Religion"},{"date": "2019-03-30T09:48:00.000Z","_id":"5dca8759ba7eab125cef39e6","value":6.5,"subject":"Physics"},{"date": "2019-12-27T12:08:00.000Z","_id":"5dca8759ba7eab125cef39e5","value":8.5,"subject":"Art"}],"__v":0,"classId":"5dc9c3112d698031f441e1c9"},
    {"_id":"5dca711c89bf46419cf5d491","ssn":"EOANEJ00J04K037K","name":"Vittoria","surname":"Bianchi","grades":[{"date": "2019-11-16T10:47:00.000Z","_id":"5dca87777a2b784f20309079","value":7.5,"subject":"Italian"}],"__v":0,"classId":"5dc9c3112d698031f441e1c9"}
];
const classes = [
    {"_id":"5dc9c3112d698031f441e1c9","name":"1A","__v":0},
    {"_id":"5dc9cb36ee91b7384cbd7fd7","name":"1B","__v":0},
    {"_id":"5dc9cb4b797f6936680521b9","name":"1C","__v":0}
];
    
module.exports = {
    students,
    classes
};