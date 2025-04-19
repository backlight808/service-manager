**`README.md`**

```markdown
# Weather Microservice

A simple Node.js microservice that stores and retrieves weather data.

## Installation

1.  Clone the repository.
2.  Run `npm install`.
3.  Create a `.env` file in the `config` directory with your MySQL configuration (see `config/config.js` for an example).
4.  Run `npm start` to start the server.

## API Endpoints

* `GET /weather/all`:  Retrieve all weather data.
* `POST /weather/store`:  Store new weather data.
* `PUT /weather/update/:id`: Update weather data for a specific ID.
* `DELETE /weather/remove/:id`: Delete weather data for a specific ID.