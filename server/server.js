var fs = require('fs');
eval(fs.readFileSync('../shared/TheHelpingHand.js')+'');
eval(fs.readFileSync('../shared/TheHelpingHand.Scene.js')+'');
eval(fs.readFileSync('../shared/TheHelpingHand.SceneRestaurant.js')+'');
eval(fs.readFileSync('../shared/TheHelpingHand.Element.js')+'');
eval(fs.readFileSync('../shared/TheHelpingHand.ElementTable.js')+'');
eval(fs.readFileSync('../shared/TheHelpingHand.Event.js')+'');
eval(fs.readFileSync('../shared/TheHelpingHand.EventHunger.js')+'');
eval(fs.readFileSync('../shared/TheHelpingHand.EventThirsty.js')+'');
eval(fs.readFileSync('../shared/TheHelpingHand.Spell.js')+'');
eval(fs.readFileSync('../shared/TheHelpingHand.SpellFoodFish.js')+'');
eval(fs.readFileSync('../shared/TheHelpingHand.SpellFoodWine.js')+'');
eval(fs.readFileSync('TheHelpingHand.Game.js')+'');
eval(fs.readFileSync('TheHelpingHand.Server.js')+'');
TheHelpingHand.Server.start();