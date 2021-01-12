async function feed(parent, args, context) {
  const where = args.filter?
  {
    OR: [
      {description: {contains: args.filter}},
      {url: {contains: args.filter}},
    ],
  }:
  {}
  const links = await context.prisma.link.findMany({
    where, 
    skip: args.skip,
    take: args.take,
    orderBy: args.orderBy
  })
  const count = await context.prisma.link.count({where})
  return {
    links,
    count
  }
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