# Restauarant booking system server

A simple restauarant booking system. [View the app here](https://rosemelissa-restaurant.netlify.app/)

[Link to frontend repo](https://github.com/rosemelissa/restaurant-frontend)

## Setup

Clone the repo and run `yarn` to install dependencies. Create a PostgreSQL database using the command in `DatabaseSchema.SQL`. Make a `.env` file by copying the `.env.example` file and replace the value of `DATABASE_URL` with the value of your database's URL.

### Adding automatic emails

Create a Gmail account that you want to use for automatically sending a confirmation email when someone makes a booking. Use the Gmail email address for the `GMAIL_USER` variable in `.env`. Go to your new Gmail account settings/security. Add 2-factor autherntication to that account. Add an App password and copy the 16 character password that is generated. Use this for the value of `GMAIL_PASSWORD` in `.env`.

## Running locally

Use the command `yarn start` or `yarn start:dev` to run the app.