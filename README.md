CMS
===

The CMS behind CodePilot.

It was built in a weekend.

Installing CodePilot CMS
--------------------------------------
This project is currently in heavy development and things might be horribly broken.
Make sure you have [Node.js](http://nodejs.org/) (& [NPM](http://npmjs.org/)), [MySQL](http://www.mysql.com/), and [Redis](http://redis.io/) installed and running.

1. Copy `app/config.example.json` to `app/config.json`. In `app/config.json`, fill in your MySQL details, Twitter OAuth information, and S3 details. If the database schema changes, open `app/models/index.js` and set the `forceDatabaseUpgrade` property to true. Restart the server, and the dabatase will be wiped and updated to the new schema, and seeded with dummy data.
2. Run `npm install`
This'll take a while as it fetches CodePilot's dependencies.
3. Run `npm start`. Assuming everything is okay, you'll be able to access CodePilot at `http://localhost:3000/`.
4. If you want data to be seeded on database upgrade, copy `app/models/fixtures.example.json` to `app/models/fixtures.json`. You can modify `app/models/fixtures.json` as necessary to change the dummy data to fit your needs. (Optional)

When you make a change, you will have to stop the server by pressing `^C`, and then start it up again.

Common Errors and how to fix them
---------------------------------

`TypeError: Uncaught, unspecified "error" event.`

This is most likely caused because your MySQL server is not running. Start the server and try again.

`Error: OAuthStrategy requires session support. Did you forget app.use(express.session(...))?`

This is caused by your Redis server not running. Start your Redis server using the `redis-server` command and try again.

`TypeError: Cannot read property 'sequelize' of undefined`

[b36b0b](https://github.com/CodePilotCo/CMS/commit/b36b0bfe37d9fcbc87d5b35159c61a412e525e21) introduced a new config option.

Update your `config.json` file to match the latest `config.example.json` template.

---

**Special thanks to:** (in no particular order)

|    Contributor    |                         GitHub                        |                       Twitter                      |
|:-----------------:|:-----------------------------------------------------:|:--------------------------------------------------:|
|   Will Smidlein   |              [ws](https://github.com/ws)              |            [ws](https://twitter.com/ws)            |
|    Joe Torraca    |        [jtorraca](https://github.com/jtorraca)        |      [jtorraca](https://twitter.com/jtorraca)      |
|    Lenny Khazan   |     [LennyKhazan](https://github.com/LennyKhazan)     |   [LennyKhazan](https://twitter.com/LennyKhazan)   |
|    Ross Penman    |      [rosspenman](https://github.com/rosspenman)      |    [PenmanRoss](https://twitter.com/PenmanRoss)    |
| Charley Hutchison |      [glenwayguy](https://github.com/glenwayguy)      |    [glenwayguy](https://twitter.com/glenwayguy)    |
|     Nick Frey     |        [NickFrey](https://github.com/nickfrey)        |      [NickFrey](https://twitter.com/NickFrey)      |
| Daniel Tomlinson  | [DanielTomlinson](https://github.com/DanielTomlinson) |       [dantoml](https://twitter.com/dantoml)       |
