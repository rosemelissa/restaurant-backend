import { Client } from "pg";
import { config } from "dotenv";
import express from "express";
import cors from "cors";
import tableIsAvailable from "./utils/tableIsAvailable";
import timeIsAvailable from "./utils/timeIsAvailable";
import getNextSevenDays from "./utils/getNextSevenDays";

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
    const allTimes = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];
    const availableTimes: string[] = [];
    for (const time of allTimes) {
      if (timeIsAvailable(time, unavailableTimes.rows, possibleTables.rows)) {
        availableTimes.push(time)
      }
    }
    
    
    
    // let availableTimes: string[] = [];
    // for (let table_id of possibleTables.rows) {
    //   let times=['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];
    //   for (let row of unavailableTimes.rows) {
    //     if ((row.table_id === table_id) && (times.includes(row.time))) {
    //       let index = times.indexOf(row.time);
    //       times = times.splice(index, 3); //remove any unavailble times from the array of possible times for this table_id
    //     }
    //   }
    //   availableTimes = [...availableTimes, ...times];
    // }
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

app.post("/newbooking", async (req, res) =>{
  try {
    const {firstname,
      surname,
      email,
      mailingList,
      numberOfPeople,
      date,
      time,} = req.body;
    const customerDb = await client.query('insert into customers(firstname, surname, email, mailing_list) values ($1, $2, $3, $4) returning customer_id', [firstname, surname, email, mailingList])
    const {customer_id} = customerDb.rows[0]
    console.log('customer id', customer_id)
    const possibleTablesDb = await client.query('select table_id from tables where capacity>=$1 order by capacity asc', [numberOfPeople]);
    const possibleTables = possibleTablesDb.rows
    console.log('possible table', possibleTables)
    let chosenTableId;
    // const allTimes=['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];
    // const index = allTimes.indexOf(time);
    // console.log(index);
    // const timesForThisBooking = [allTimes[index], allTimes[index + 1], allTimes[index + 2]]
    // console.log(timesForThisBooking)
    for (let row of possibleTables) {
      const {table_id} = row
      const bookingsDb = await client.query('select time from bookings where table_id=$1 and date=$2', [table_id, date])
      const bookingsForThatTable = bookingsDb.rows;
      if (tableIsAvailable(bookingsForThatTable, time)) {
        chosenTableId = table_id;
        console.log('using table', chosenTableId)
        break;
      }
      console.log('bookingsforthattable', bookingsForThatTable)
    }
    if (chosenTableId) {
      const booking_id = await client.query('insert into bookings(customer_id, table_id, date, time, covers) values ($1 ,$2, $3, $4, $5) returning booking_id', [customer_id, chosenTableId, date, time, numberOfPeople])
      res.json(booking_id.rows)
    } else {
      res.json({"error": "No table available"})
    }
  } catch (error) {
    console.error(error)
  }
})

app.get("/covers/:date", async (req, res) => {
  try {
    const date = req.params.date;
    const sevenDays: string[] = getNextSevenDays(date);
    console.log(sevenDays)
    console.log(sevenDays)
    const coversDb = await client.query('select date, sum(covers) as total_covers from bookings where date in ($1, $2, $3, $4, $5, $6, $7) group by date', [...sevenDays])

    // const coversDb = await client.query('select date, sum(covers) as total_covers from bookings where date in $1 group by date', [sevenDays])
    res.json(coversDb.rows)
  } catch (error) {
    console.error(error);
  }

})

app.get("/bookingsdata/:date", async (req, res) => {
  try {
    const date = req.params.date;
    const bookingsDataDb = await client.query('select * from bookings left join customers on bookings.customer_id = customers.customer_id where date = $1 order by bookings.time, bookings.table_id', [date])
    res.json(bookingsDataDb.rows);
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
