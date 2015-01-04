var fs = require('fs');
eval(fs.readFileSync('../shared/TheHelpingHand.js')+'');
eval(fs.readFileSync('../shared/TheHelpingHand.Scene.js')+'');
eval(fs.readFileSync('../shared/TheHelpingHand.SceneRestaurant.js')+'');
eval(fs.readFileSync('TheHelpingHand.Server.js')+'');
TheHelpingHand.Server.start();