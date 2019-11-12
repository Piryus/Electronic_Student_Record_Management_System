# Mock database

## SchoolClass

|_id|name|
|---|----|
|5dc9c3112d698031f441e1c9|1A|
|5dc9cb36ee91b7384cbd7fd7|1B|
|5dc9cb4b797f6936680521b9|1C|

## Teacher

|_id|userId|ssn|name|surname|subjects|
|---|---|---|---|---|---|
|5dca698eed550e4ca4aba7f5|5dca7e2b461dc52d681804f1|DJRFUC56J13E485F|Marco|Bianchi|Italian, History|
|5dca69cf048e8e40d434017f|5dca7e2b461dc52d681804f2|CMFOLR29R45S203O|Roberta|Verdi|Math, Physics|
|5dca6cbe7adca3346c5983cb|5dca7e2b461dc52d681804f3|LDFVUI17P04D491B|Stefano|Rossi|Latin|
|5dca6cd5b83a1f3ef03e962b|5dca7e2b461dc52d681804f4|SCBGMN21E45O956Q|Peter|Posta|Art|
|5dca6cf0a92bbb4dd8c0e817|5dca7e2b461dc52d681804f5|PLVCGT02S19R549A|Federica|Valli|English|
|5dca6d0801ea271794cb650e|5dca7e2b461dc52d681804f6|LCFTUI58S49G910R|Cinzia|Tollo|Science|
|5dca6d2038627d0bfc4167b0|5dca7e2b461dc52d681804f7|QASVUM68G45D297P|Dario|Resti|Gym|
|5dca6d3620607b1e30dea42a|5dca7e2b461dc52d681804f8|NCFTOG69F23B796K|Nina|Fassio|Religion|

## Student

|_id|ssn|name|surname|classId|
|---|---|---|---|---|
|5dca711c89bf46419cf5d483|MDFGKO06L02F082G|Marco|Cremonesi|5dc9c3112d698031f441e1c9|
|5dca711c89bf46419cf5d484|FCEEHG02B04N054D|Luca|Longo|5dc9c3112d698031f441e1c9|
|5dca711c89bf46419cf5d485|JPCOME07O02C034H|Alice|Capon|5dc9c3112d698031f441e1c9|
|5dca711c89bf46419cf5d486|JLMLBH00B07K064G|Alessio|Mazzi|5dc9c3112d698031f441e1c9|
|5dca711c89bf46419cf5d487|CCJNJM09K01P046D|Maria|Palermo|5dc9c3112d698031f441e1c9|
|5dca711c89bf46419cf5d488|LMNNML01B05F051C|Silvia|Ferrari|5dc9c3112d698031f441e1c9|
|5dca711c89bf46419cf5d489|MGOAAP05I08P020M|Enzo|Cremonesi|5dc9c3112d698031f441e1c9|
|5dca711c89bf46419cf5d48a|NAMAKH06I03P070A|Francesca|Trentino|5dc9c3112d698031f441e1c9|
|5dca711c89bf46419cf5d48b|OJCHFE07F05M064L|Myriam|Manfrin|5dc9c3112d698031f441e1c9|
|5dca711c89bf46419cf5d48c|IFHMHK01L07L058D|Giacomo|Lori|5dc9c3112d698031f441e1c9|
|5dca711c89bf46419cf5d48d|KDKNJL01L05F034A|Paolo|Pirozzi|5dc9c3112d698031f441e1c9|
|5dca711c89bf46419cf5d48e|PBFNDJ01E04O002B|Anna|Bianchi|5dc9c3112d698031f441e1c9|
|5dca711c89bf46419cf5d48f|AKFKCL03M05K075K|Geremia|Costa|5dc9c3112d698031f441e1c9|
|5dca711c89bf46419cf5d490|GPNCID08N09N089B|Riccardo|Cocci|5dc9c3112d698031f441e1c9|
|5dca711c89bf46419cf5d491|EOANEJ00J04K037K|Vittoria|Bianchi|5dc9c3112d698031f441e1c9|

## Parent

|_id|userId|ssn|name|surname|children|
|---|---|---|---|---|---|
|5dca77de05972e0898e9c68d|5dca7e2b461dc52d681804f9|FAHKGA04F01L081M|Davide|Capon|5dca711c89bf46419cf5d485|
|5dca77f47af8500cf8668f06|5dca7e2b461dc52d681804fa|JFMCL00C02H025N|Tiziana|Gentile|5dca711c89bf46419cf5d485|
|5dca781462307a4f84dd86d5|5dca7e2b461dc52d681804fb|ELFLIP03J08D056L|Barbara|Galli|5dca711c89bf46419cf5d483, 5dca711c89bf46419cf5d489|
|5dca7825e60dac32e4828699|5dca7e2b461dc52d681804fc|GCOLGO03C09K019O|Fabio|Cremonesi|5dca711c89bf46419cf5d483, 5dca711c89bf46419cf5d489|
|5dca784dcf1db14678f3cadb|5dca7e2b461dc52d681804fd|BCOAEN01B09O049L|Lucia|Monge|5dca711c89bf46419cf5d48e, 5dca711c89bf46419cf5d491|
|5dca78645953000328b6131b|5dca7e2b461dc52d681804fe|GELOEN01E09P064N|Corrado|Bianchi|5dca711c89bf46419cf5d48e, 5dca711c89bf46419cf5d491|

## User

|_id|mail|password|scope
|---|---|---|---|
|5dca7e2b461dc52d681804f0|admin@admin.com|admin|admin|
|5dca7e2b461dc52d681804f1|mario.bianchi@teacher.com|teacher1|teacher|
|5dca7e2b461dc52d681804f2|roberta.verdi@teacher.com|teacher2|teacher|
|5dca7e2b461dc52d681804f3|stefano.rossi@teacher.com|teacher3|teacher|
|5dca7e2b461dc52d681804f4|peter.posta@teacher.com|teacher4|teacher|
|5dca7e2b461dc52d681804f5|federica.valli@teacher.com|teacher5|teacher|
|5dca7e2b461dc52d681804f6|cinzia.tollo@teacher.com|teacher6|teacher|
|5dca7e2b461dc52d681804f7|dario.resti@teacher.com|teacher7|teacher|
|5dca7e2b461dc52d681804f8|nina.fassio@teacher.com|teacher8|teacher|
|5dca7e2b461dc52d681804f9|davide.capon@parent.com|parentA_1|parent|
|5dca7e2b461dc52d681804fa|tiziana.gentile@parent.com|parentA_2|parent|
|5dca7e2b461dc52d681804fb|barbara.galli@parent.com|parentB_1|parent|
|5dca7e2b461dc52d681804fc|fabio.cremonesi@parent.com|parentB_2|parent|
|5dca7e2b461dc52d681804fd|lucia.monge@parent.com|parentC_1|parent|
|5dca7e2b461dc52d681804fe|corrado.bianchi@parent.com|parentC_2|parent|

## Grades

|studentId|value|subject|date|
|---|---|---|---|
|5dca711c89bf46419cf5d485|6|Latin|2019-04-08T07:57:00.000Z|
|5dca711c89bf46419cf5d48c|4|Physics|2019-03-27T07:09:00.000Z|
|5dca711c89bf46419cf5d48c|8|Math|2019-06-30T06:24:00.000Z|
|5dca711c89bf46419cf5d485|6.5|English|2019-06-23T11:50:00.000Z|
|5dca711c89bf46419cf5d485|8.75|Art|2019-12-14T12:49:00.000Z|
|5dca711c89bf46419cf5d48e|8.5|Art|2019-12-23T08:15:00.000Z|
|5dca711c89bf46419cf5d48e|7.75|Gym|2019-08-11T06:09:00.000Z|
|5dca711c89bf46419cf5d484|3|English|2019-02-13T07:30:00.000Z|
|5dca711c89bf46419cf5d48c|7|Physics|2019-03-30T10:02:00.000Z|
|5dca711c89bf46419cf5d48e|6.5|History|2019-02-02T10:20:00.000Z|
|5dca711c89bf46419cf5d48b|3.75|Science|2019-01-10T10:55:00.000Z|
|5dca711c89bf46419cf5d486|4.25|English|2019-05-13T06:22:00.000Z|
|5dca711c89bf46419cf5d48d|5.5|Physics|2019-12-10T07:49:00.000Z|
|5dca711c89bf46419cf5d485|7|Science|2019-12-30T11:27:00.000Z|
|5dca711c89bf46419cf5d490|3.75|Religion|2019-11-13T11:55:00.000Z|
|5dca711c89bf46419cf5d48a|8.5|English|2019-01-25T09:00:00.000Z|
|5dca711c89bf46419cf5d486|3|Science|2019-09-26T10:03:00.000Z|
|5dca711c89bf46419cf5d48b|5.75|Religion|2019-12-12T11:19:00.000Z|
|5dca711c89bf46419cf5d491|7.5|Italian|2019-11-16T10:47:00.000Z|
|5dca711c89bf46419cf5d483|5|Art|2019-10-16T07:58:00.000Z|
|5dca711c89bf46419cf5d489|4.75|Math|2019-03-26T07:55:00.000Z|
|5dca711c89bf46419cf5d486|6.25|Religion|2019-03-06T11:48:00.000Z|
|5dca711c89bf46419cf5d489|4.5|English|2019-10-23T08:15:00.000Z|
|5dca711c89bf46419cf5d486|5.75|History|2019-07-09T11:21:00.000Z|
|5dca711c89bf46419cf5d484|9.75|Science|2019-12-03T09:14:00.000Z|
|5dca711c89bf46419cf5d48e|4.25|Gym|2019-03-25T12:01:00.000Z|
|5dca711c89bf46419cf5d48c|3.5|Physics|2019-11-24T10:39:00.000Z|
|5dca711c89bf46419cf5d490|6.5|Physics|2019-03-30T09:48:00.000Z|
|5dca711c89bf46419cf5d490|8.5|Art|2019-12-27T12:08:00.000Z|
|5dca711c89bf46419cf5d487|4.75|Gym|2019-06-23T08:08:00.000Z|
