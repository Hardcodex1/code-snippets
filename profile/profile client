import { MessageEmbed } from "discord.js";

async function slash(
  client: any,
  interaction: any,
  socket: any,
  emojiData: any,
  UserID: any
) {
  const waitEmbed = new MessageEmbed()
    .setTitle(`<a:loading:${emojiData.loading}> Profile`)
    .setDescription("Waiting For Confirmation From Server")
    .setColor("#ADD8E6")
    .setThumbnail(
      "https://cdn.discordapp.com/attachments/932563564743495730/940509115506122772/person-icon.png"
    )
    .setFooter({
      text: `Latency: ${Math.abs(Date.now() - interaction.createdTimestamp)}`,
    });
  await interaction.reply({ embeds: [waitEmbed] });

  let ID;
  let check = 0;
  if (UserID) {
    ID = UserID;
    check = 1;
  } else ID = interaction.options?.get("name")?.value;

  if (!ID) {
    ID = interaction.options?.get("user")?.value;
    check = 1;
  }

  if (!ID) {
    ID = interaction.user.id;
    check = 1;
  }

  socket.emit("profile", { //retrive info from server (websocket server side)
    param: ID,
    check,
    interaction: interaction.id,
  });
  socket.on(`profile-${interaction.id}`, async (data: any) => { //recieved data from websocket server
    await interaction.editReply({ embeds: [data] });
  });
}

export { slash };
