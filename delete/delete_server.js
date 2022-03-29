async function deleteAccount(ID) {

  let user = await registerSchema.find({ID})

  let crosserror = client.emojis.cache?.find(
    (emoji) => emoji.name == "cross"
  ).id;

  let ErrorEmbed = new MessageEmbed()
  .setTitle(`<a:cross:${crosserror}> No Active Account`)
  .setDescription(`You Don't Have An Active Account!`)
  .setColor("#ffcccb")

  if (!user[0] || !user[0]?.name) return ErrorEmbed

  //deleting all user data 100%
  await registerSchema.deleteOne({ID})
  await swipeSchema.findOneAndDelete({ID1: ID})
  await swipeSchema.findOneAndDelete({ID2: ID})
  await require("../schemas/matchSchema").findOneAndDelete({ID1: user[0].name})
  await require("../schemas/matchSchema").findOneAndDelete({ID2: user[0].name})
  await require("../schemas/lovecallSchema").findOneAndDelete({ID1: user[0].ID})
  await require("../schemas/lovecallSchema").findOneAndDelete({ID2: user[0].ID})

  let tick = client.emojis.cache?.find(
    (emoji) => emoji.name == "tick"
  ).id;
  
  let Embed = new MessageEmbed()
  .setTitle(`<a:tick:${tick}> Account Deleted`)
  .setDescription("All Your Data Has Been Erased From Our Database")
  .setColor("#FFFFF")
  .setThumbnail(
          "https://cdn.discordapp.com/attachments/932563564743495730/941583716105469992/Super_Angry_Face_Emoji_ios10_grande.png"
        )

  const users = await registerSchema.find({TOS: "Accepted"})

   client.user.setPresence(
    { 
        activities: [
            { 
                name: `Finding Love In ${client.guilds.cache.size} Servers For ${users.length} Users`, 
                type: 'LISTENING' 
            }
        ], 
        status: "dnd"
    }
   ) 

  return Embed
}
