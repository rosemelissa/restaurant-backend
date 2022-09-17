import { Client } from "pg";
import { config } from "dotenv";
import express from "express";
import cors from "cors";

config(); //Read .env file lines as though they were env vars.

//Call this script with the environment variable LOCAL set if you want to connect to a local db (i.e. without SSL)
//Do not set the environment variable LOCAL if you want to connect to a heroku DB.

//For the ssl property of the DB connection config, use a value of...
// false - when connecting to a local DB
// { rejectUnauthorized: false } - when connecting to a heroku DB
const herokuSSLSetting = { rejectUnauthorized: false }
const sslSetting = process.env.LOCAL ? false : herokuSSLSetting
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: herokuSSLSetting,
};

const app = express();

app.use(express.json()); //add body parser to each following route handler
app.use(cors()) //add CORS support to each following route handler

const client = new Client(dbConfig);
client.connect();

app.get("/", async (req, res) => {
  const dbres = await client.query('select * from tables');
  res.json(dbres.rows);
});

app.get("/possibletimes/:date/:numberofpeople", async (req, res) => {
  try {
    const date: string = req.params.date;
    const numberOfPeople: number = parseInt(req.params.numberofpeople);
    const possibleTables = await client.query('select table_id from tables where capacity >= $1', [numberOfPeople])
    const unavailableTimes = await client.query('select bookings.table_id, bookings.time from bookings left join tables on bookings.table_id = tables.table_id where date=$1 and bookings.table_id in (select table_id from tables where capacity >= $2)', [date, numberOfPeople])
    let availableTimes: string[] = [];
    for (let table_id of possibleTables.rows) {
      let times=['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];
      for (let row of unavailableTimes.rows) {
        if ((row.table_id === table_id) && (times.includes(row.time))) {
          let index = times.indexOf(row.time);
          times = times.splice(index, 3); //remove any unavailble times from the array of possible times for this table_id
        }
      }
      availableTimes = [...availableTimes, ...times];
    }
    let uniqueAvailableTimes: string[] = [];
    for (let time of availableTimes) {
      if (!uniqueAvailableTimes.includes(time)) {
        uniqueAvailableTimes.push(time);
      }
    }
    res.send(uniqueAvailableTimes);
  } catch (error) {
    console.error(error);
  }
})


//Start the server on the given port
const port = process.env.PORT;
if (!port) {
  throw 'Missing PORT environment variable.  Set it in .env file.';
}
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
