CMS
===

The CMS behind CodePilot.

It was built in a weekend.

Screencast 1: Installing CodePilot CMS
--------------------------------------
This project is currently in heavy development and things might be horribly broken. 
Make sure you have node (+ npm), MySQL, and Redis installed and running.

1. Copy app/config.example.json to app/config.json
Fill in your MySQL details and Twitter OAuth Key details. Don't worry about migrations, those are handled behind the scenes.
2. Run npm install  
This'll take a while as it fetches CodePilot's dependencies.
3. Run npm start  
Assuming everything is okay, you'll be able to access CodePilot at http://localhost:3000/


---

**Special thanks to:** (in no particular order)

|    Contributor    |                         GitHub                        |                       Twitter                      |
|:-----------------:|:-----------------------------------------------------:|:--------------------------------------------------:|
|   Will Smidlein   |              [ws](https://github.com/ws)              |            [ws](https://twitter.com/ws)            |
|    Joe Torraca    |        [jtorraca](https://github.com/jtorraca)        |      [jtorraca](https://twitter.com/jtorraca)      |
|    Lenny Khazan   |     [LennyKhazan‎](https://github.com/LennyKhazan‎)     |   [LennyKhazan‎](https://twitter.com/LennyKhazan‎)   |
|    Ross Penman    |      [rosspenman](https://github.com/rosspenman)      |    [PenmanRoss‎](https://twitter.com/PenmanRoss‎)    |
| Charley Hutchison |      [glenwayguy](https://github.com/glenwayguy)      |    [glenwayguy](https://twitter.com/glenwayguy)    |
|     Nick Frey     |        [NickFrey‎](https://github.com/NickFrey‎)        |      [NickFrey‎](https://twitter.com/NickFrey‎)      |
| Daniel Tomlinson  | [DanielTomlinson](https://github.com/DanielTomlinson) |       [dantoml‎](https://twitter.com/dantoml‎)       |
