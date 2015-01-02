var fs = require('fs');
eval(fs.readFileSync('../shared/TheHelpingHand.js')+'');
eval(fs.readFileSync('TheHelpingHand.Server.js')+'');
TheHelpingHand.Server.start();