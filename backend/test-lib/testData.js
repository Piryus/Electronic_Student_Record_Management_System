'use strict';

const students = [
    {"_id":"5dca711c89bf46419cf5d483","ssn":"MDFGKO06L02F082G","name":"Marco","surname":"Cremonesi","attendanceEvents":[],"notes":[],"termGrades":[],"grades":[{"date": "2019-10-16T07:58:00.000Z","value":"5","subject":"Art"}],"__v":0,"classId":"5dc9c3112d698031f441e1c9"},
    {"_id":"5dca711c89bf46419cf5d484","ssn":"FCEEHG02B04N054D","name":"Luca","surname":"Longo","attendanceEvents":[],"notes":[],"termGrades":[],"grades":[{"date": "2019-02-13T07:30:00.000Z","value":"3","subject":"English"},{"date": "2019-12-03T09:14:00.000Z","value":"9.75","subject":"Science"}],"__v":0,"classId":"5dc9c3112d698031f441e1c9"},
    {"_id":"5dca711c89bf46419cf5d485","ssn":"JPCOME07O02C034H","name":"Alice","surname":"Capon","attendanceEvents":[],"notes":[],"termGrades":[],"grades":[{"date": "2019-04-08T07:57:00.000Z","value":"6","subject":"Latin"},{"date": "2019-06-23T11:50:00.000Z","value":"6.5","subject":"English"},{"date": "2019-12-14T12:49:00.000Z","value":"8.75","subject":"Art"},{"date": "2019-12-30T11:27:00.000Z","value":"7","subject":"Science"}],"__v":0,"classId":"5dc9c3112d698031f441e1c9"},
    {"_id":"5dca711c89bf46419cf5d486","ssn":"JLMLBH00B07K064G","name":"Alessio","surname":"Mazzi","attendanceEvents":[],"notes":[],"termGrades":[],"grades":[{"date": "2019-05-13T06:22:00.000Z","value":"4.25","subject":"English"},{"date": "2019-09-26T10:03:00.000Z","value":"3","subject":"Science"},{"date": "2019-03-06T11:48:00.000Z","value":"6.25","subject":"Religion"},{"date": "2019-07-09T11:21:00.000Z","value":"5.75","subject":"History"}],"__v":0,"classId":"5dc9cb4b797f6936680521b9"},
    {"_id":"5dca711c89bf46419cf5d487","ssn":"CCJNJM09K01P046D","name":"Maria","surname":"Palermo","attendanceEvents":[],"notes":[],"termGrades":[],"grades":[{"date": "2019-06-23T08:08:00.000Z","value":"4.75","subject":"Gym"}],"__v":0,"classId":"5dc9c3112d698031f441e1c9"},
    {"_id":"5dca711c89bf46419cf5d488","ssn":"LMNNML01B05F051C","name":"Silvia","surname":"Ferrari","attendanceEvents":[],"notes":[],"termGrades":[],"grades":[],"__v":0,"classId":"5dc9c3112d698031f441e1c9"},
    {"_id":"5dca711c89bf46419cf5d489","ssn":"MGOAAP05I08P020M","name":"Enzo","surname":"Cremonesi","attendanceEvents":[],"notes":[],"termGrades":[],"grades":[{"date": "2019-03-26T07:55:00.000Z","value":"4.75","subject":"Math"},{"date": "2019-10-23T08:15:00.000Z","value":"4.5","subject":"English"}],"__v":0,"classId":"5dc9c3112d698031f441e1c9"},
    {"_id":"5dca711c89bf46419cf5d48a","ssn":"NAMAKH06I03P070A","name":"Francesca","surname":"Trentino","attendanceEvents":[],"notes":[],"termGrades":[],"grades":[{"date": "2019-01-25T09:00:00.000Z","value":"8.5","subject":"English"}],"__v":0,"classId":"5dc9cb4b797f6936680521b9"},
    {"_id":"5dca711c89bf46419cf5d48b","ssn":"OJCHFE07F05M064L","name":"Myriam","surname":"Manfrino","attendanceEvents":[],"notes":[],"termGrades":[],"grades":[{"date": "2019-01-10T10:55:00.000Z","value":"3.75","subject":"Science"},{"date": "2019-12-12T11:19:00.000Z","value":"5.75","subject":"Religion"}],"__v":0,"classId":"5dc9c3112d698031f441e1c9"},
    {"_id":"5dca711c89bf46419cf5d48c","ssn":"IFHMHK01L07L058D","name":"Giacomo","surname":"Lori","attendanceEvents":[],"notes":[],"termGrades":[],"grades":[{"date": "2019-03-27T07:09:00.000Z","value":"4","subject":"Physics"},{"date": "2019-06-30T06:24:00.000Z","value":"8","subject":"Math"},{"date": "2019-03-30T10:02:00.000Z","value":"7","subject":"Physics"},{"date": "2019-11-24T10:39:00.000Z","value":"3.5","subject":"Physics"}],"__v":0,"classId":"5dc9c3112d698031f441e1c9"},
    {"_id":"5dca711c89bf46419cf5d48d","ssn":"KDKNJL01L05F034A","name":"Paolo","surname":"Pirozzi","attendanceEvents":[],"notes":[],"termGrades":[],"grades":[{"date": "2019-12-10T07:49:00.000Z","value":"5.5","subject":"Physics"}],"__v":0,"classId":"5dc9cb4b797f6936680521b9"},
    {"_id":"5dca711c89bf46419cf5d48e","ssn":"PBFNDJ01E04O002B","name":"Anna","surname":"Bianchi","attendanceEvents":[],"notes":[],"termGrades":[],"grades":[{"date": "2019-12-23T08:15:00.000Z","value":"8.5","subject":"Art"},{"date": "2019-08-11T06:09:00.000Z","value":"7.75","subject":"Gym"},{"date": "2019-02-02T10:20:00.000Z","value":"6.5","subject":"History"},{"date": "2019-03-25T12:01:00.000Z","value":"4.25","subject":"Gym"}],"__v":0,"classId":"5dc9c3112d698031f441e1c9"},
    {"_id":"5dca711c89bf46419cf5d48f","ssn":"AKFKCL03M05K075K","name":"Geremia","surname":"Costa","attendanceEvents":[],"notes":[],"termGrades":[],"grades":[],"__v":0,"classId":"5dc9c3112d698031f441e1c9"},
    {"_id":"5dca711c89bf46419cf5d490","ssn":"GPNCID08N09N089B","name":"Riccardo","surname":"Cocci","attendanceEvents":[],"notes":[],"termGrades":[],"grades":[{"date": "2019-11-13T11:55:00.000Z","value":"3.75","subject":"Religion"},{"date": "2019-03-30T09:48:00.000Z","value":"6.5","subject":"Physics"},{"date": "2019-12-27T12:08:00.000Z","value":"8.5","subject":"Art"}],"__v":0,"classId":"5dc9cb4b797f6936680521b9"},
    {"_id":"5dca711c89bf46419cf5d491","ssn":"EOANEJ00J04K037K","name":"Vittoria","surname":"Bianchi","attendanceEvents":[],"notes":[],"termGrades":[],"grades":[{"date": "2019-11-16T10:47:00.000Z","value":"7.5","subject":"Italian"}],"__v":0,"classId":"5dc9c3112d698031f441e1c9"}
];
const parents = [
    {"children":["5dca711c89bf46419cf5d485","5dca711c89bf46419cf5d48b"],"_id":"5dca77de05972e0898e9c68d","userId":"5dca7e2b461dc52d681804f9","__v":0},
    {"children":["5dca711c89bf46419cf5d485"],"_id":"5dca77f47af8500cf8668f06","userId":"5dca7e2b461dc52d681804fa","__v":0},
    {"children":["5dca711c89bf46419cf5d483","5dca711c89bf46419cf5d489"],"_id":"5dca781462307a4f84dd86d5","userId":"5dca7e2b461dc52d681804fb","__v":0},
    {"children":["5dca711c89bf46419cf5d483","5dca711c89bf46419cf5d489"],"_id":"5dca7825e60dac32e4828699","userId":"5dca7e2b461dc52d681804fc","__v":0},
    {"children":["5dca711c89bf46419cf5d48e","5dca711c89bf46419cf5d491"],"_id":"5dca784dcf1db14678f3cadb","userId":"5dca7e2b461dc52d681804fd","__v":0},
    {"children":["5dca711c89bf46419cf5d48e","5dca711c89bf46419cf5d491"],"_id":"5dca78645953000328b6131b","userId":"5dca7e2b461dc52d681804fe","__v":0},
    {"children":["5dca711c89bf46419cf5d48a"],"_id":"5dca78645953ffff28b6131b","userId":"5dca7e2b46ffff2d681804fe","__v":0}
];
const teachers = [
    {"subjects":["Italian","History"],"_id":"5dca698eed550e4ca4aba7f5","userId":"5dca7e2b461dc52d681804f1","timetable":[{"_id":"5dca736f85f1d338e47047cc","classId":"5dc9c3112d698031f441e1c9","subject":"Italian","weekhour":"0_1"},{"_id":"5dca736f85f1d338e47047cb","classId":"5dc9c3112d698031f441e1c9","subject":"History","weekhour":"1_0"},{"_id":"5dca736f85f1d338e47047ca","classId":"5dc9c3112d698031f441e1c9","subject":"Italian","weekhour":"1_1"},{"_id":"5dca736f85f1d338e47047c9","classId":"5dc9c3112d698031f441e1c9","subject":"Italian","weekhour":"2_0"},{"_id":"5dca736f85f1d338e47047c8","classId":"5dc9c3112d698031f441e1c9","subject":"Italian","weekhour":"2_1"},{"_id":"5dca736f85f1d338e47047c7","classId":"5dc9c3112d698031f441e1c9","subject":"History","weekhour":"3_1"}],"__v":0},
    {"subjects":["Math","Physics"],"_id":"5dca69cf048e8e40d434017f","userId":"5dca7e2b461dc52d681804f2","timetable":[{"_id":"5dca73d9f118890e0404b200","classId":"5dc9c3112d698031f441e1c9","subject":"Math","weekhour":"0_0"},{"_id":"5dca73d9f118890e0404b1ff","classId":"5dc9c3112d698031f441e1c9","subject":"Math","weekhour":"1_4"},{"_id":"5dca73d9f118890e0404b1fe","classId":"5dc9c3112d698031f441e1c9","subject":"Physics","weekhour":"1_5"},{"_id":"5dca73d9f118890e0404b1fd","classId":"5dc9c3112d698031f441e1c9","subject":"Math","weekhour":"3_2"},{"_id":"5dca73d9f118890e0404b1fc","classId":"5dc9c3112d698031f441e1c9","subject":"Math","weekhour":"3_3"},{"_id":"5dca73d9f118890e0404b1fb","classId":"5dc9c3112d698031f441e1c9","subject":"Physics","weekhour":"4_0"},{"_id":"5dca73d9f118890e0404b1fa","classId":"5dc9c3112d698031f441e1c9","subject":"Math","weekhour":"4_4"}],"__v":0},
    {"subjects":["Latin"],"_id":"5dca6cbe7adca3346c5983cb","userId":"5dca7e2b461dc52d681804f3","timetable":[{"_id":"5dca74188b61531b74d26191","classId":"5dc9c3112d698031f441e1c9","subject":"Latin","weekhour":"0_3"},{"_id":"5dca74188b61531b74d26190","classId":"5dc9c3112d698031f441e1c9","subject":"Latin","weekhour":"0_4"},{"_id":"5dca74188b61531b74d2618f","classId":"5dc9c3112d698031f441e1c9","subject":"Latin","weekhour":"2_4"},{"_id":"5dca74188b61531b74d2618e","classId":"5dc9c3112d698031f441e1c9","subject":"Latin","weekhour":"4_2"}],"__v":0},
    {"subjects":["Art"],"_id":"5dca6cd5b83a1f3ef03e962b","userId":"5dca7e2b461dc52d681804f4","timetable":[{"_id":"5dca74440a647541cc0f769d","classId":"5dc9c3112d698031f441e1c9","subject":"Art","weekhour":"0_2"},{"_id":"5dca74440a647541cc0f769c","classId":"5dc9c3112d698031f441e1c9","subject":"Art","weekhour":"4_5"}],"__v":0},
    {"subjects":["English"],"_id":"5dca6cf0a92bbb4dd8c0e817","userId":"5dca7e2b461dc52d681804f5","timetable":[{"_id":"5dca7482162d8a4c3415a19d","classId":"5dc9c3112d698031f441e1c9","subject":"English","weekhour":"1_2"},{"_id":"5dca7482162d8a4c3415a19c","classId":"5dc9c3112d698031f441e1c9","subject":"English","weekhour":"2_2"},{"_id":"5dca7482162d8a4c3415a19b","classId":"5dc9c3112d698031f441e1c9","subject":"English","weekhour":"3_0"}],"__v":0},
    {"subjects":["Science"],"_id":"5dca6d0801ea271794cb650e","userId":"5dca7e2b461dc52d681804f6","timetable":[{"_id":"5dca74c25e8b78434870c301","classId":"5dc9c3112d698031f441e1c9","subject":"Science","weekhour":"2_3"},{"_id":"5dca74c25e8b78434870c300","classId":"5dc9c3112d698031f441e1c9","subject":"Science","weekhour":"4_3"}],"__v":0},
    {"subjects":["Gym"],"_id":"5dca6d2038627d0bfc4167b0","userId":"5dca7e2b461dc52d681804f7","timetable":[{"_id":"5dca74e843fa6b4200966b0c","classId":"5dc9c3112d698031f441e1c9","subject":"Gym","weekhour":"1_3"},{"_id":"5dca74e843fa6b4200966b0b","classId":"5dc9c3112d698031f441e1c9","subject":"Gym","weekhour":"4_1"}],"__v":0},
    {"subjects":["Religion"],"_id":"5dca6d3620607b1e30dea42a","userId":"5dca7e2b461dc52d681804f8","timetable":[{"_id":"5dca750ac5cb424cfc0a5310","classId":"5dc9c3112d698031f441e1c9","subject":"Religion","weekhour":"3_4"}],"__v":0}
];
const users = [
    {"_id":"5dca7e2b461dc52d681804f0","scope":["admin"],"mail":"admin@admin.com","password":"adminadmin","__v":"0"},
    {"_id":"5dca7e2b461dc52d681804f1","ssn":"DJRFUC56J13E485F","name":"Mario","surname":"Bianchi","scope":["teacher"],"mail":"mario.bianchi@teacher.com","password":"teacher1","__v":"0"},
    {"_id":"5dca7e2b461dc52d681804f2","ssn":"CMFOLR29R45S203O","name":"Roberta","surname":"Verdi","scope":["teacher"],"mail":"roberta.verdi@teacher.com","password":"teacher2","__v":"0"},
    {"_id":"5dca7e2b461dc52d681804f3","ssn":"LDFVUI17P04D491B","name":"Stefano","surname":"Rossi","scope":["teacher"],"mail":"stefano.rossi@teacher.com","password":"teacher3","__v":"0"},
    {"_id":"5dca7e2b461dc52d681804f4","ssn":"SCBGMN21E45O956Q","name":"Peter","surname":"Posta","scope":["teacher"],"mail":"peter.posta@teacher.com","password":"teacher4","__v":"0"},
    {"_id":"5dca7e2b461dc52d681804f5","ssn":"PLVCGT02S19R549A","name":"Federica","surname":"Valli","scope":["teacher"],"mail":"federica.valli@teacher.com","password":"teacher5","__v":"0"},
    {"_id":"5dca7e2b461dc52d681804f6","ssn":"LCFTUI58S49G910R","name":"Cinzia","surname":"Tollo","scope":["teacher"],"mail":"cinzia.tollo@teacher.com","password":"teacher6","__v":"0"},
    {"_id":"5dca7e2b461dc52d681804f7","ssn":"QASVUM68G45D297P","name":"Dario","surname":"Resti","scope":["teacher"],"mail":"dario.resti@teacher.com","password":"teacher7","__v":"0"},
    {"_id":"5dca7e2b461dc52d681804f8","ssn":"NCFTOG69F23B796K","name":"Nina","surname":"Fassio","scope":["teacher"],"mail":"nina.fassio@teacher.com","password":"teacher8","__v":"0"},
    {"_id":"5dca7e2b461dc52d681804f9","ssn":"FAHKGA04F01L081M","name":"Davide","surname":"Capon","scope":["parent"],"mail":"davide.capon@parent.com","password":"parentA_1","__v":"0"},
    {"_id":"5dca7e2b461dc52d681804fa","ssn":"JFMCL00C02H025N","name":"Tiziana","surname":"Gentile","scope":["parent"],"mail":"tiziana.gentile@parent.com","password":"parentA_2","__v":"0"},
    {"_id":"5dca7e2b461dc52d681804fb","ssn":"ELFLIP03J08D056L","name":"Barbara","surname":"Galli","scope":["parent"],"mail":"barbara.galli@parent.com","password":"parentB_1","__v":"0"},
    {"_id":"5dca7e2b461dc52d681804fc","ssn":"GCOLGO03C09K019O","name":"Fabio","surname":"Cremonesi","scope":["parent"],"mail":"fabio.cremonesi@parent.com","password":"parentB_2","__v":"0"},
    {"_id":"5dca7e2b461dc52d681804fd","ssn":"BCOAEN01B09O049L","name":"Lucia","surname":"Monge","scope":["parent"],"mail":"lucia.monge@parent.com","password":"parentC_1","__v":"0"},
    {"_id":"5dca7e2b461dc52d681804fe","ssn":"GELOEN01E09P064N","name":"Corrado","surname":"Bianchi","scope":["parent"],"mail":"corrado.bianchi@parent.com","password":"parentC_2","__v":"0"},
    {"_id":"5dcc0bb71c9d440000330d8d","ssn":"BUNDJF54I96E295F","name":"Oreste","surname":"Filippi","scope":["officer"],"mail":"officer1@officer.com","password":"officerofficer","__v":"0"},
    {"_id":"5dcc0bb71c9d440000330d0e","ssn":"DCMGUR58F13C593P","name":"Alessia","surname":"Genzi","scope":["officer"],"mail":"officer2@officer.com","password":"officerofficer","__v":"0"},
    {"_id":"5dcc0bb71c9d440000330d45","ssn":"XYEIBL20D49T545W","name":"Massimo","surname":"Corsi","scope":["officer"],"mail":"officer3@officer.com","password":"officerofficer","__v":"0"},
];
const classes = [
    {"_id":"5dc9c3112d698031f441e1c9","assignments":[],"name":"1A","coordinator":"5dca698eed550e4ca4aba7f5","__v":0},
    {"_id":"5dc9cb36ee91b7384cbd7fd7","assignments":[],"name":"1B","__v":0},
    {"_id":"5dc9cb4b797f6936680521b9","assignments":[],"name":"1C","__v":0}
];
const articles = [
    {"_id":"5ddbd4a7881cbd1a30645ceb","title":"Example title","content":"Some very important information here.","authorId":"5dcc0bb71c9d440000330d8d","date":"2019-11-14T11:24:17.000Z","__v":0},
    {"_id":"5ddbd4a7881cbd1a30645cec","title":"Communications","content":"Everything is going to be fine.","authorId":"5dcc0bb71c9d440000330d0e","date":"2019-11-20T18:45:38.000Z","__v":0},
    {"_id":"5ddbd4a7881cbd1a30645ced","title":"News feed","content":"School will be closed for Christmas holidays.","authorId":"5dcc0bb71c9d440000330d45","date":"2019-10-19T16:10:31.000Z","__v":0},
    {"_id":"5ddbd4a7881cbd1a30645cee","title":"Warning!","content":"Check local media.","authorId":"5dcc0bb71c9d440000330d45","date":"2019-11-05T08:58:17.000Z","__v":0},
    {"_id":"5ddbd4a7881cbd1a30645cef","title":"Read this carefully","content":"Some more information here.","authorId":"5dcc0bb71c9d4400003fffff","date":"2019-10-10T09:32:42.000Z","__v":0},
    {"_id":"5ddbd4a7881cbd1a30645cf0","title":"Not a title","content":"This is a test.","authorId":"5dcc0bb71c9d440000330d45","date":"2019-11-24T12:51:58.000Z","__v":0}
];
const files = [
    { _id: '5dc9c3112d698031f882d0c9', filename: 'periodic_table.txt', bytes: 4503, type: 'text/plain' },
    { _id: '5dc9c3112d698031f882d0ca', filename: 'math_formulas.pdf', bytes: 14039, type: 'application/pdf' },
    { _id: '5dc9c3112d698031f882d0cb', filename: 'divina_commedia.txt', bytes: 83264, type: 'text/plain' },
    { _id: '5dc9c3112d698031f882d0cc', filename: 'math_formulas_2.pdf', bytes: 9910, type: 'application/pdf' }
];
    
module.exports = {
    students,
    parents,
    teachers,
    users,
    classes,
    articles,
    files
};