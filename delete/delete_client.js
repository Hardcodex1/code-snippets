import { MessageEmbed } from "discord.js";

async function slash(
  client: any,
  interaction: any,
  socket: any,
  emojiData: any
) {
  const option = await interaction.options?.get("choice")?.value;
  if (option == "no")
    return await interaction.reply({
      content: "Process Cancelled",
      ephemeral: true,
    });
  const waitEmbed = new MessageEmbed()
    .setTitle(`<a:loading:${emojiData.loading}> Account Delete`)
    .setDescription("Waiting For Confirmation From Server")
    .setColor("#ADD8E6")
    .setThumbnail(
      "https://cdn.discordapp.com/attachments/932563564743495730/941583716105469992/Super_Angry_Face_Emoji_ios10_grande.png"
    )
    .setFooter({
      text: `Latency: ${Math.abs(Date.now() - interaction.createdTimestamp)}`,
    });
  await interaction.reply({ embeds: [waitEmbed], components: [] });

  socket.emit("delete_account", {
    ID: interaction.user.id,
    interaction: interaction.id,
  });
  socket.on(`delete_account-${interaction.id}`, async (data: any) => {
    await interaction.editReply({ embeds: [data] });
  });
}

export { slash };
