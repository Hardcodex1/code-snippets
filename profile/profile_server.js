const { MessageEmbed } = require("discord.js");
const registerSchema = require("../schemas/registerSchema.js");
const client = require("../botLogin");

module.exports = async (param, check) => {
  let user;

  if (check == 0) user = await registerSchema.find({ name: param }); //get data from database
  else if (check == 1) user = await registerSchema.find({ ID: param }); 

  let crosserror = client.emojis.cache?.find(
    (emoji) => emoji.name == "cross"
  ).id;

  let ErrorEmbed = new MessageEmbed()
    .setTitle(`<a:cross:${crosserror}> User Not Found`)
    .setDescription(
      `The Entered User Does Not Exist Or You Don't Have An Active Account`
    )
    .setColor("#ffcccb");

  if (!user[0] || !user[0]?.name || !user[0]?.gender) return ErrorEmbed;

  let hobbies = "No Hobbies Set";
  if (user[0].hobbies[0]) {
    hobbies = "";
    user[0].hobbies.forEach((hobby) => {
      hobbies = hobbies + hobby + " , ";
    });
  }

  let userAvatar = await client.users.fetch(user[0].ID);

  if (userAvatar) {
    userAvatar = userAvatar.avatarURL({ dynamic: true });
  } else {
    userAvatar =
      "https://cdn.discordapp.com/attachments/882894510395379712/944954050296836106/de901o7-d61b3bfb-f1b1-453b-8268-9200130bbc65.png";
  }

  let tick = client.emojis.cache?.find((emoji) => emoji.name == "tick").id;
  let male = client.emojis.cache?.find((emoji) => emoji.name == "male").id;
  let female = client.emojis.cache?.find((emoji) => emoji.name == "female").id;
  let hearts = client.emojis.cache?.find((emoji) => emoji.name == "hearts").id;
  let bio = client.emojis.cache?.find((emoji) => emoji.name == "bio").id;
  let alert = client.emojis.cache?.find((emoji) => emoji.name == "alert").id;
  let age = client.emojis.cache?.find((emoji) => emoji.name == "age").id;
  let hobby = client.emojis.cache?.find((emoji) => emoji.name == "hobby").id;

  let emoji =
    user[0]?.gender == "male" ? `<:male:${male}>` : `<:female:${female}>`;

  const color = user[0]?.gender == "male" ? "#1F51FF" : "#FF10F0";
  const embed = new MessageEmbed()
    .setTitle(`<a:tick:${tick}> Profile Of ${user[0].name}`)
    .setDescription(
      `<a:hearts:${hearts}> Name: \`${user[0].name}\` \n<:age:${age}> Age: \`${
        user[0].ageHidden ? "[Redacted For Privacy]" : "[Redacted For Privacy]"
      }\` \n${emoji} Gender: \`${user[0].gender}\` \n<a:bio:${bio}> Bio: \`${
        user[0].bio ? user[0].bio : "Just A User Finding People On Dislove"
      }\` \n<a:alert:${alert}> Status: \`${
        user[0].matched ? "Taken" : "Single"
      }\` \n<a:hobby:${hobby}> Hobbies: \`${hobbies}\``
    )
    .setThumbnail(userAvatar)
    .setColor(color);

  return embed;
};
