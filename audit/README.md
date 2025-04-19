**`README.md`**

```markdown
# Audit Microservice

This microservice listens for messages from the weather service when a record is deleted
and stores an audit log in the database.

## Installation

1.  Clone the repository.
2.  Run `npm install`.
3.  Create a `.env` file in the `config` directory with your MySQL and RabbitMQ configuration.
4.  Run `npm start` to start the server.