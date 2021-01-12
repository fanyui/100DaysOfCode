function feed(parent, args, context) {
  const where = args.filter?
  {
    OR: [
      {description: {contains: args.filter}},
      {url: {contains: args.filter}},
    ],
  }:
  {}
  const links = await context.prisma.link.findMany({where})
  return links
    // return context.prisma.link.findMany()
}
function info(){return 'This is API for hackernews Clone'}

function link(parent, args, context){
    const link = context.prisma.link.findFirst({
        where:{
          id: args.id
        }
      })
   return link
}
module.exports = {
    feed,
    info,
    link
}