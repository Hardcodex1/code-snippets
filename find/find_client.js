//getting users from database, sorting and displaying in the form of embed

import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { userLog } from "../logs/userLog";

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
  const waitEmbed = new MessageEmbed()
    .setTitle(`<a:loading:${emojiData.loading}> Find Match System`)
    .setDescription("Waiting For Confirmation From Server")
    .setColor("#ADD8E6")
    .setThumbnail(
      "https://cdn.discordapp.com/attachments/932563564743495730/940510627456229436/Two_Pink_Hearts_Emoji_grande.png"
    )
    .setFooter({
      text: `Latency: ${Math.abs(Date.now() - interaction.createdTimestamp)}`,
    });
  await interaction.reply({ embeds: [waitEmbed], components: [] });

  socket.emit("find", {
    ID: interaction.user.id,
    interaction: interaction.id,
  });
  socket.on(`find-${interaction.id}`, async (data: any) => {
    if (data.errors[0]) {
      return await interaction.editReply({ embeds: [data.errors[0]] });
    } else if (data.data[0]) {
      let length = data.data.length;
      let row = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("find_accept")
          .setLabel(`Swipe`)
          .setEmoji(emojiData.tick)
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("find_next")
          .setLabel("Next")
          .setEmoji(emojiData.swipe)
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("report_user")
          .setLabel("Report")
          .setEmoji(emojiData.report)
          .setStyle("DANGER"),
        new MessageButton()
          .setCustomId("find_clear")
          .setLabel(`Clear Queue`)
          .setEmoji(emojiData.trash)
          .setStyle("DANGER")
      );

      let users = data.data;
      let check = false;
      let user = await randomIndex(users);
      while (check == false) { //sorting
        user = await randomIndex(users);
        let data = userLog.get(interaction.user.id);
        if (!data) {
          data = [user.ID];
          userLog.set(interaction.user.id, data);
          check = true;
        } else if (!data.find((value: any) => value == user.ID)) {
          data = [...data, user.ID];
          userLog.set(interaction.user.id, data);
          check = true;
        } else {
          if (data.length == length) {
            check = true;
            return await interaction.editReply({
              content: "You have Browsed through all profiles.",
              embeds: [],
              components: [],
            });
          }
        }
      }
      let difference = "No Age Difference Detected";
      let emoji =
        user.gender == "male"
          ? `<:male:${emojiData.male}>`
          : `<:female:${emojiData.female}>`;
      if (isNaN(parseInt(data.author.age)) || isNaN(parseInt(user.age)))
        difference = "Incorrect Age Found ⛔";
      const color = user.gender == "male" ? "#1F51FF" : "#FF10F0";
      let p = 0;
      p =
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
      if (p == 15) difference = "1 Year Difference ⚠️";
      if (p == 5) difference = "2 Years Difference ☢️";
      if (p == 0) difference = "3 years or greater difference ⛔";
      user.hobbies.forEach((hobby: String) => {
        if (data.author.hobbies[0])
          p = data.author.hobbies?.includes(hobby) ? p + 35 : p;
      });
      let avatar = "";
      let member = await client.users.fetch(user.ID);
      if (!member)
        avatar =
          "https://cdn.discordapp.com/attachments/882894510395379712/944954050296836106/de901o7-d61b3bfb-f1b1-453b-8268-9200130bbc65.png";
      if (member) avatar = member.avatarURL({ dynamic: true });
      let hobbies = "No Hobbies Set";
      if (user.hobbies[0]) {
        hobbies = "";
        user.hobbies.forEach((hobby: String) => {
          hobbies = hobbies + hobby + " , ";
        });
      }
      const userEmbed = new MessageEmbed()
        .setTitle("Users")
        .setColor(color)

        .addFields(
          {
            name: `<a:hearts:${emojiData.hearts}> Username:`,
            value: `\`${user.name}\``,
          },
          {
            name: `<:age:${emojiData.age}> Age:`,
            value: `\`"[Redacted For Privacy]" //age not displayed
            \``,
          },
          {
            name: `<a:alert:${emojiData.alert}> Warning:`,
            value: `\`${difference}\``,
          },
          {
            name: `<a:bio:${emojiData.bio}> Bio:`,
            value: `\`${
              user.bio ? user.bio : "Just A User Finding People On Dislove"
            }\``,
          },
          {
            name: `${emoji} Gender:`,
            value: `\`${user.gender}\``,
          },
          {
            name: `<a:match:${emojiData.match}> Match Rate:`,
            value: `\`${p}%\``,
          },
          {
            name: `<a:hobby:${emojiData.hobby}> Hobbies:`,
            value: `\`${hobbies}\``,
          },
          {
            name: "Please Note: Do Not Randomly Swipe Every User You See. Find The Perfect Profile Then Swipe",
            value: `\`You Have Only 2 Free Swipes Every 2 hours. 1 Extra Swipe For Votting!\``,
          }
        )
        .setThumbnail(avatar)
        .setAuthor({ name: user.name, iconURL: avatar })
        .setFooter({
          text: interaction.user.id,
          iconURL: interaction.user.avatarURL(),
        });

      return await interaction
        .editReply({
          embeds: [userEmbed],
          components: [row],
        })
        .then(() => {
          row = new MessageActionRow().addComponents(
            row.components[0].setDisabled(true),
            row.components[1].setDisabled(true),
            row.components[2].setDisabled(true),
            row.components[3].setDisabled(true)
          );
          setTimeout(
            () => interaction.editReply({ components: [row] }),
            120000
          );
        });
    }
  });
}

async function buttons(
  client: any,
  interaction: any,
  socket: any,
  emojiData: any
) {
  if (interaction.customId == "find_next") {
    socket.emit("find", {
      ID: interaction.user.id,
      interaction: interaction.id,
    }); //fix dep adad

    const waitEmbed = new MessageEmbed()
      .setTitle(`<a:loading:${emojiData.loading}> Find Match System`)
      .setDescription("Waiting For Confirmation From Server")
      .setColor("#ADD8E6")
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/932563564743495730/940510627456229436/Two_Pink_Hearts_Emoji_grande.png"
      )
      .setFooter({
        text: `Latency: ${Math.abs(Date.now() - interaction.createdTimestamp)}`,
      });
    await interaction.update({ embeds: [waitEmbed] });

    socket.on(`find-${interaction.id}`, async (data: any) => {
      if (data.errors[0]) {
        return await interaction.update({ embeds: [data.errors[0]] });
      } else if (data.data[0]) {
        let users = data.data;
        let length = data.data.length;
        let check = false;
        let user = await randomIndex(users);
        while (check == false) {
          user = await randomIndex(users);
          let data = userLog.get(interaction.user.id);
          if (!data) {
            data = [user.ID];
            userLog.set(interaction.user.id, data);
            check = true;
          } else if (!data.find((value: any) => value == user.ID)) {
            data = [...data, user.ID];
            userLog.set(interaction.user.id, data);
            check = true;
          } else {
            if (data.length == length) {
              userLog.delete(interaction.user.id);
              check = true;
              return await interaction.editReply({
                content: "You have Browsed through all profiles. `Queue Reset`",
                embeds: [],
                components: [],
              });
            }
          }
        }
        if (user) {
          let difference = "No Age Difference Detected";
          if (isNaN(parseInt(data.author.age)) || isNaN(parseInt(user.age)))
            difference = "Incorrect Age Found ⛔";
          const color = user.gender == "male" ? "#1F51FF" : "#FF10F0";
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

          if (p == 15) difference = "1 Year Difference ⚠️";
          if (p == 5) difference = "2 Years Difference ☢️";
          if (p == 0) difference = "3 years or greater difference ⛔";
          user.hobbies.forEach((hobby: String) => {
            if (data.author.hobbies[0])
              p = data.author.hobbies?.includes(hobby) ? p + 35 : p;
          });
          let avatar = "";
          let emoji =
            user.gender == "male"
              ? `<:male:${emojiData.male}>`
              : `<:female:${emojiData.female}>`;
          let member = await client.users.fetch(user.ID);
          if (!member)
            avatar =
              "https://cdn.discordapp.com/attachments/882894510395379712/944954050296836106/de901o7-d61b3bfb-f1b1-453b-8268-9200130bbc65.png";
          if (member) avatar = member.avatarURL({ dynamic: true });
          let hobbies = "No Hobbies Set";
          if (user.hobbies[0]) {
            hobbies = "";
            user.hobbies.forEach((hobby: String) => {
              hobbies = hobbies + hobby + " , ";
            });
          }
          const userEmbed = new MessageEmbed()
            .setTitle("Users")
            .setColor(color)
            .addFields(
              {
                name: `<a:hearts:${emojiData.hearts}> Username:`,
                value: `\`${user.name}\``,
              },
              {
                name: `<:age:${emojiData.age}> Age:`,
                value: `\`"[Redacted For Privacy]"\``,
              },
              {
                name: `<a:alert:${emojiData.alert}> Warning:`,
                value: `\`${difference}\``,
              },
              {
                name: `<a:bio:${emojiData.bio}> Bio:`,
                value: `\`${
                  user.bio ? user.bio : "Just A User Finding People On Dislove"
                }\``,
              },
              {
                name: `${emoji} Gender:`,
                value: `\`${user.gender}\``,
              },
              {
                name: `<a:match:${emojiData.match}> Match Rate:`,
                value: `\`${p}%\``,
              },
              {
                name: `<a:hobby:${emojiData.hobby}> Hobbies:`,
                value: `\`${hobbies}\``,
              },
              {
                name: "Please Note: Do Not Randomly Swipe Every User You See. Find The Perfect Profile Then Swipe",
                value: `\`You Have Only 2 Free Swipes Every 2 hours. 1 Extra Swipe For Votting!\``,
              }
            )
            .setThumbnail(avatar)
            .setAuthor({ name: user.name, iconURL: avatar })
            .setFooter({
              text: interaction.user.id,
              iconURL: interaction.user.avatarURL(),
            });

          await interaction.editReply({ embeds: [userEmbed] });
        }
      }
    });
  } else if (interaction.customId == "find_accept") {
    const name = interaction.message.embeds[0].author.name;
    const userID = interaction.user.id;
    socket.emit("swipe", { name, userID, interaction: interaction.id });
    socket.on(`swipe-${interaction.id}`, async (data: any) => {
      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setLabel("Vote Link!")
          .setURL("https://top.gg/bot/942348989150421012/vote")
          .setStyle("LINK")
      );
      userLog.delete(interaction.user.id);
      await interaction.update({
        embeds: [data],
        components: [row],
        content: "Vote For The Bot To `Get 1 Extra Swipe`",
      });
    });
  } else if (interaction.customId == "find_clear") {
    userLog.delete(interaction.user.id);
    await interaction.update({
      content: `Queue Has Been Cleared <a:tick:${emojiData.tick}>`,
      components: [],
      embeds: [],
    });
  }
}

export { slash, buttons };
