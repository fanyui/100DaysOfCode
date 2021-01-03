     // 2
     async function post (parent, args, context){
        const newLink = context.prisma.link.create({
            data: {
                url: args.url,
                description: args.description
            }
        })
        return newLink;
    }
    async function updateLink(parent, args, context){
       const link = context.prisma.link.update({where:{
            id: args.id
          },data: {description: args.description, url: args.url}
        })
        return link
    }
    async function deleteLink(parent, args, context){
        let link = context.prisma.link.delete({where:{id: args.id}})
        return link;

    }
    module.exports = {
        post,
        updateLink,
        deleteLink
    }