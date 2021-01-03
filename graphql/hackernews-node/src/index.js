const {ApolloServer, PubSub} = require('apollo-server');
const fs = require('fs');
const path = require('path')
const {PrismaClient} = require('@prisma/client')
const  {post, updateLink, deleteLink } =  require('./resolvers/Mutation')
const prisma = new PrismaClient()
const pubsub = new PubSub()
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
        post,
        updateLink,
        deleteLink
    }
}

// 3 
const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    context:({req}) => {
        return {
            ...req,
            prisma,
            pubsub,
            userId: 
                req && req.headers.authorization
                    ? getUserId(req)
                    : null
        }
        prisma
    }
})

server.listen()
.then(({url}) => 
    console.log(`Server is running on ${url}`)
)   