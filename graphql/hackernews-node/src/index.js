const {ApolloServer} = require('apollo-server');
const fs = require('fs');
const path = require('path')
const {PrismaClient} = require('@prisma/client')

const prisma = new PrismaClient()

// 1
const resolvers = {
    Query: {
        info: () => 'This is API for hackernews Clone',
        feed: (parent, args, context) => {
            return context.prisma.link.findMany()
        },
        link: (parent, args, context) =>{
            const link = context.prisma.link.findFirst({
                where:{
                  id: args.id
                }
              })
           return link
        },
    },
    Mutation: {
        // 2
        post: (parent, args, context) => {
            const newLink = context.prisma.link.create({
                data: {
                    url: args.url,
                    description: args.description
                }
            })
            return newLink;
        },
        updateLink: (parent, args, context) => {
           const link = context.prisma.link.update({where:{
                id: args.id
              },data: {description: args.description, url: args.url}
            })
            return link
        },
        deleteLink: (parent, args, context) => {
            let link = context.prisma.link.delete({where:{id: args.id}})
            return link;

        }
    }
}

// 3 
const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    context:{
        prisma
    }
})

server.listen()
.then(({url}) => 
    console.log(`Server is running on ${url}`)
)   