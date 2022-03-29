const {MessageEmbed} = require("discord.js")
const registerSchema = require("../schemas/registerSchema.js")
const logs = new Map()
const client = require("../botLogin")

module.exports = async (ID, option) => {
  let user = await registerSchema.find(
    {
      ID
    }
  )

  let userData;
let crosserror = client.emojis.cache?.find(
    (emoji) => emoji.name == "cross"
  ).id;
  let ErrorEmbed = new MessageEmbed()
     .setTitle(`<a:cross:${crosserror}> User Not Found`)
     .setDescription(`You Don't Have An Active Account \nUse /help <register> to make one`)
     .setColor("#ffcccb")
  

  if (!user[0] || !user[0]?.name) return {data: [], errors: [ErrorEmbed]}

  if (user[0].gender == undefined || !user[0]) return {data: [], errors: [ErrorEmbed]}

  ErrorEmbed = new MessageEmbed()
     .setTitle(`<a:cross:${crosserror}> Omg Why Cheat`)
     .setDescription(`Your already matched, why cheat`)
     .setColor("#ffcccb")

  let gender = user[0].gender

  if (option == 0) {
    if (user[0].matched == true) return {data: [], errors: [ErrorEmbed]}
    if (gender == "male")
  {
    userData = await registerSchema.find({
      gender: "female",
      matched: false,
      visible: true,
    })
  }
  else if (gender == "female")
  {
    userData = await registerSchema.find({
      gender: "male",
      matched: false,
      visible: true,
    })
  }
 } else if (option == 1) {
   if (logs.has(ID))
  {
    const firstTime = logs.get(ID)
    let check = Math.abs(new Date().getMinutes() - firstTime)
    if (check >= 2) logs.delete(ID)
    if (check < 2)
    {
      ErrorEmbed = new MessageEmbed()
   .setTitle(`<a:cross:${crosserror}> Friend Find Unsuccessfull`)
  .setDescription(`Error: 404 you Need To Wait 2 Mins Before Finding Another Friend`)
  .setColor("#ffcccb")
  return {data: [], errors: [ErrorEmbed]}
    }
    else
    logs.delete(ID)
  }
   ErrorEmbed = new MessageEmbed()
     .setTitle(`<a:cross:${crosserror}> Friend Settings Turned Off`)
     .setDescription(`In order to use this command please run /friend_settings on`)
     .setColor("#ffcccb")
   if (!user[0].friend == true) return {data: [], errors: [ErrorEmbed]}
    userData = await registerSchema.find({
      friend: true,
      lovecall: true
    })
 }

  ErrorEmbed = new MessageEmbed()
     .setTitle(`<a:cross:${crosserror}> No Users Found`)
     .setDescription(`There Are Currently No Users To Display, \`Please Try Again Later\``)
     .setColor("#ffcccb")

  if (!userData[0]) return {data: [], errors: [ErrorEmbed]}

  if (!userData[0]) return {data: [], errors: [ErrorEmbed]}

  if (userData[0].length == 1 && userData[0].ID == ID) return {data: [], errors: [ErrorEmbed]}

  if (option == 1) logs.set(ID, new Date().getMinutes())

  return {data: userData, errors: [], author: user[0]}

}
