**OUT OF DATE**
We are currently refactoring things and this documentation is out of date.

Key planned changes so far:

1. Changing terminology throughout: Server -> Unity Game, Client -> Viewer Interface
2. Twitch APIs need to be updated
3. More robust Meta Data pipeline
4. Evaluating commitment to Phaser

# apg

This is the work-in-progress Audience Participation Game Project.

Here are some things you should know if you want to use it.

### THE SERVER
__________

As currently written, the architecture uses Twitch's IRC to communicate, so any game that wants to use the HTML5 client needs to be able
to connect to Twitch's IRC channels, authenticate, and then read and write messages to IRC.

In the project here, the streamer's game is written in Unity, and it has an IRC client, as well as some infrastructure code scaffolding
the client, keep tracking of players, and extract information from the IRC channel to put in a more reasonable format for game code.

The Unity library is found here: https://github.com/Ludolab/apg/tree/master/Unity%20APG%20Main%20Game/Assets/Scripts/APG

In the long run, this should be pretty stand alone, and would be the only code you would add to a Unity project, hopefully with a minimum
of fuss.

#### Setting up the components in the Unity editor

At present, there is also a unity IRC component you have to add to your project.  Look in the main Unity game to see that in action.  Its
name in the editor is IRC Game Logic Chat.  This Game Object has a script attached to it called Twitch Game Logic Chat.  The Twitch Game
Logic Chat has a number of fields that need to be set (in the future, there should be a nicer interface for this in the game proper).
In particular, you MUST set 
  
1. Logic Oauth
2. Logic Channel Name
3. Chat Oauth
4. Chat Channel name
5. Game Client ID
6. Redirect Webpage
   
Chat channel should be your twitch account name.  Chat oauth should be an oauth for your Twitch account, which you can generate here:
http://www.twitchapps.com/tmi/.  It should look like this: oauth:5rse5basug5w2glamb9e4qetp60rcx .  Make sure to include "oauth:" in there.

Logic channel should be a second, different twitch account that you more than likely will need to make.  This is a second IRC channel that is just used for game network traffic.  We do this so that the streamers chat room, which is of course meant to be social, doesn't get clogged up with messy game logic updates.  And Logic Oauth should be an oauth attached to this channel.

To register a webpage with twitch for your game client, and to get a Twitch game client ID, go here: https://www.twitch.tv/kraken/oauth2/clients/new

There are some other fields in there that do some other useful things, but this is the bare minimum you need to do to have a game that connects to Twitch's IRC successfully.  I'll document the other features better later.

I will likewise try to make deployment on the Unity side easier later.  In the mean time, loading up the existing game is a good way to see the components as they are intended to be used.

#### Setting up the Unity code

[MORE FORTHCOMING]

### THE HTML5 Client
__________

Some notes, right off the bat:

This client uses PhaserJs: https://phaser.io/

It is written in Typescript.

It uses Twitch's Javascript TMI library https://docs.tmijs.org/ to communicate with Twitch's servers.

[MORE FORTHCOMING]
