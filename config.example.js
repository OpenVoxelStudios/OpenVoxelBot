module.exports = {
    token: '', // Put your bot token here, DONT SHARE IT!! Create your bot here: https://discord.com/developers/applications
    channels: { // Put channel IDs here, get them with the developer mode
        welcome: '',
        log: '',
        counter: '',
        copychan: '',
    },
    copychanhook: '', // The webhook URL for the copy channel

    coinByMessage: {
        messageCount: 10, // Number of messages to send
        points: 1,        // To get that amount of points
    },
    coinForInvite: {
        messageCount: 10, // Amount of messages to send to be able to gain
        points: 10        // That amount of points
    },
    shop: [
        // Format:
        /* 
        
        {
            name: "NAME OF THE THING",
            price: PRICE,
            role: "ROLE GIVEN ONCE BUYED (role ID)",
        },
        
        */
       // Just add these 5 lines below, to add another item, just add these lines again
    ],
    message_reward: [
        // Format:
        /* 
        
        {
            name: "Name of the Role",
            messages: NUMBER,
            role: "ROLE GIVEN (role ID)",
        },
        
        */
       // Just add these 5 lines below, to add another item, just add these lines again
    ],
    color: '#xxxxxx', // A hexadecimal color
    server: { // The Minecraft Server config
        ip: 'localhost', // The Minecraft IP address
        port: 25566, // The port to connect to
    },
}