import { MessageEmbed } from "discord.js";

const randomIndex = (data: Array<any>) => {
  let length = data.length;
  if (length == 1) return data[0];
  else {
    let index = Math.random() * length;
    index = Math.round(index);
    if (data[index]) return data[index];
    else return data[index - 1];
  }
};

async function slash(
  client: any,
  interaction: any,
  socket: any,
  emojiData: any
) {
  let waitEmbed = new MessageEmbed()
    .setTitle("Friend Match")
    .setDescription("Waiting For Confirmation From Server")
    .setColor("#ADD8E6")
    .setThumbnail(
      "https://cdn.discordapp.com/attachments/932563564743495730/941761188251967589/man-emoji-png-8.png"
    )
    .setFooter({
      text: `Latency: ${Math.abs(Date.now() - interaction.createdTimestamp)}`,
    });
  await interaction.reply({
    embeds: [waitEmbed],
    components: [],
    ephemeral: true,
  });
  socket.emit("friend", {
    ID: interaction.user.id,
    interaction: interaction.id,
  });
  socket.on(`friend-${interaction.id}`, async (data: any) => {
    if (data.errors[0])
      return await interaction.editReply({
        embeds: [data.errors[0]],
      });
    let check = false;
    let user;
    while (check == false) {
      user = randomIndex(data.data);
      if (user.ID != interaction.user.id) check = true;
    }

    waitEmbed = new MessageEmbed()
      .setTitle("Friend Match")
      .setDescription(
        "No Friend Available At The Moment. Please Try Again Later"
      )
      .setColor("#ADD8E6") //idk
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/932563564743495730/941761188251967589/man-emoji-png-8.png"
      );

    if (check != true) {
      return await interaction.editReply({ embeds: [waitEmbed] });
    }
    check = false;
    const color = user.gender == "male" ? "#1F51FF" : "#FF10F0";
    let avatar = "";
    let member = await client.users.fetch(user.ID);
    if (!member)
      avatar =
        "https://cdn.discordapp.com/attachments/882894510395379712/944954050296836106/de901o7-d61b3bfb-f1b1-453b-8268-9200130bbc65.png";
    if (member) avatar = member.avatarURL({ dynamic: true });
    let difference = "No Age Difference Detected";
    if (isNaN(parseInt(data.author.age)) || isNaN(parseInt(user.age)))
      difference = "Incorrect Age Found ⛔";
    let p =
      parseInt(user.age) === parseInt(data.author.age)
        ? 30
        : parseInt(user.age) === parseInt(data.author.age) - 1
        ? 15
        : parseInt(user.age) === parseInt(data.author.age) + 1
        ? 15
        : parseInt(user.age) === parseInt(data.author.age) - 2
        ? 5
        : parseInt(user.age) === parseInt(data.author.age) + 2
        ? 5
        : 0;

    if (p == 15) difference = "Small Age Difference ⚠️";
    if (p == 5) difference = "2 Years Difference ☢️";
    if (p == 0) difference = "Major age difference ⛔";
    const userEmbed = new MessageEmbed()
      .setTitle("Users")
      .setColor(color)
      .setDescription(
        `Name: \`${user.name}\` \nAge: \`[Redacted For Privacy]\` \nGender: \`${user.gender}\` \n⚠️ Notice: ${difference}`
      )
      .addFields({
        name: "If You Like This Match You Can Contact The User Via The Command",
        value: "`/lovecall <call> <name>`",
      })
      .setThumbnail(avatar);

    return await interaction.editReply({
      embeds: [userEmbed],
      ephemeral: true,
    });
  });
}

export { slash };
