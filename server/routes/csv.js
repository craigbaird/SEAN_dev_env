var express = require('express');
var router = express.Router();
var csvtojson = require('csvtojson');
var json2csv = require('json2csv');
var pool = require('../modules/pool');

// GET request - volunteer hours .csv file
router.get('/export/hours/:fromDate/:toDate', function(req, res, next) {
  if(req.isAuthenticated()) {
    var fromDate = req.params.fromDate;
    var toDate = req.params.toDate;
    // connects to the pool
    pool.connect(function(errorConnectingToDatabase,db,done) {
      if(errorConnectingToDatabase) {
        res.sendStatus(500);
      } else {
        // query that selects all volunteer hours for a selected period of time
        var jsonQuery = 'SELECT volunteer.first_name as "First Name", volunteer.last_name as "Last Name", volunteer.email as "Email", ' +
        'volunteer_hours.date as "Date", volunteer_hours.time_in as "Time in", volunteer_hours.time_out as "Time out" ' +
        'FROM volunteer JOIN volunteer_hours ON volunteer.id = volunteer_hours.volunteer_id ' +
        'WHERE volunteer_hours.date >= $1 and volunteer_hours.date <= $2';
        db.query(jsonQuery, [fromDate, toDate], function(queryError,result) {
          done();
          if (queryError) {
            res.sendStatus(500);
          } else {
            // converts query resutl to JSON
            var jsonString = JSON.stringify(result.rows);
            var json = JSON.parse(jsonString);
            // parameters for json2csv function
            var opts = {
              data: json,
              fields: ['First Name', 'Last Name', 'Email', 'Date', 'Time in', 'Time out'],
              quotes: ''
            };
            // converts json data to csv
            var result = json2csv(opts);
            // sends csv file to client
            res.attachment('volunteer_hours.csv');
            res.status(200).send(result);
          } // else
        }); // db.query
      } // else
    }); // pool.connect
  } else {
    res.sendStatus(401);
  }
});

// GET request - office hours .csv file
router.get('/export/officeHours/:fromDate/:toDate', function(req, res, next) {
  if(req.isAuthenticated()) {
    var fromDate = req.params.fromDate;
    var toDate = req.params.toDate;
    // connects to the pool
    pool.connect(function(errorConnectingToDatabase,db,done) {
      if(errorConnectingToDatabase) {
        res.sendStatus(500);
      } else {
        // query that selects all office hours for a selected period of time
        var jsonQuery = 'SELECT volunteer_hours.staff_name as "Staff Username", ' +
        'volunteer_hours.date as "Date", volunteer_hours.time_in as "Time in", ' +
        'volunteer_hours.time_out as "Time out" FROM volunteer_hours ' +
        'WHERE volunteer_hours.date >= $1 and volunteer_hours.date <= $2' +
        'AND volunteer_hours.staff_name IS NOT NULL';
        db.query(jsonQuery, [fromDate, toDate], function(queryError,result) {
          done();
          if (queryError) {
            res.sendStatus(500);
          } else {
            // converts query resutl to JSON
            var jsonString = JSON.stringify(result.rows);
            var json = JSON.parse(jsonString);
            // parameters for json2csv function
            var opts = {
              data: json,
              fields: ['Staff Username', 'Date', 'Time in', 'Time out'],
              quotes: ''
            };
            // converts json data to csv
            var result = json2csv(opts);
            // sends csv file to client
            res.attachment('office_hours.csv');
            res.status(200).send(result);
          } // else
        }); // db.query
      } // else
    }); // pool.connect
  } else {
    res.sendStatus(401);
  }
});

// GET request - volunteer .csv file
router.get('/export/volunteer', function(req, res, next) {
  if(req.isAuthenticated()) {
    // connects to the pool
    pool.connect(function(errorConnectingToDatabase,db,done) {
      if(errorConnectingToDatabase) {
        res.sendStatus(500);
      } else {
        // query that selects all volunteers registered on the system
        var jsonQuery = 'SELECT first_name as "First Name", last_name as "Last Name", email as "Email", parent_email as "Parent Email" FROM volunteer';
        db.query(jsonQuery,function(queryError,result) {
          done();
          if (queryError) {
            res.sendStatus(500);
          } else {
            // converts query resutl to JSON
            var jsonString = JSON.stringify(result.rows);
            var json = JSON.parse(jsonString);
            // parameters for json2csv function
            var opts = {
              data: json,
              fields: ['First Name', 'Last Name', 'Email', 'Parent Email'],
              quotes: ''
            };
            // converts json data to csv
            var result = json2csv(opts);
            // sends csv file to client
            res.attachment('volunteers.csv');
            res.status(200).send(result);
          } // else
        }); // db.query
      } // else
    }); // pool.connect
  } else {
    res.sendStatus(401);
  }
});

// Handles POST request with new volunteer data
router.post('/upload', function(req, res, next) {
  if(req.isAuthenticated()) {
    var fileContent = req.body.fileContent;
    var message = '';
    // deletes temporary table
    deleteJSONTable();
    // converts fileContent to JSON
    csvtojson({noheader:false})
    .fromString(fileContent)
    .on('end_parsed',function(jsonArrObj) {
      // Inserts into json_volunteer table
      pool.connect(function(errorConnectingToDatabase,db,done) {
        if(errorConnectingToDatabase) {
          console.log('Error connecting to the database');
        } else {
          for (var i = 0; i < jsonArrObj.length; i++) {
            jsonObject = jsonArrObj[i];
            db.query('INSERT INTO json_volunteer (info) VALUES ($1);',
            [jsonObject], function(queryError,result) {
              if (queryError) {
                console.log('Error inserting into json_volunteer table');
              }
            });
          } // end of for loop
          // Moves information into volunteer table
          db.query("INSERT INTO volunteer (first_name, last_name, email) " +
          "SELECT INITCAP(info ->> 'First Name') AS first_name, INITCAP(info ->> 'Last Name') AS last_name, " +
          "LOWER(info ->> 'Email') AS email FROM json_volunteer " +
          "ON CONFLICT DO NOTHING;",
           function(queryError,result) {
            done();
            if (queryError) {
              message = 'Error importing volunteers.';
              res.send(message);
            } else {
              message = 'Import successful. ' + result.rowCount + ' volunteers added to the database.';
              res.send(message);
            }
          });
        };
      }); // pool.connect
    }); // end of csvtojson
  } else {
    res.sendStatus(401);
  }
});

// Deletes JSON formatted volunteer table
function deleteJSONTable() {
  pool.connect(function(errorConnectingToDatabase,db,done) {
    if(errorConnectingToDatabase) {
      console.log('Error connecting to the database');
    } else {
      db.query('DELETE FROM json_volunteer', function(queryError,result) {
        done();
        if (queryError) {
          console.log('Error deleting json_volunteer table');
        }
      });
    }
  });
};


module.exports = router;
