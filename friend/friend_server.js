async function friend(ID) {
  let user = await registerSchema.find(
    {
      ID
    }
  )

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
