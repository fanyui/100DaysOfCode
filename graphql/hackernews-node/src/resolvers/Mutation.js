const { buildSchemaFromTypeDefinitions } = require("apollo-server");
const bcrypt= require('bcryptjs')
const jwt= require('jsonwebtoken')
const {APP_SECRET, getUserId} = require('../utils')
     // 2
     async function post (parent, args, context, info){
         const {userId}  = context
        const newLink = context.prisma.link.create({
            data: {
                url: args.url,
                description: args.description,
                postedBy: {connect: {id: userId}},
            }
        })
          context.pubsub.publish("NEW_LINK", newLink)
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
    async function signup(parent, args, context, info){
        const password = await bcrypt.hash(args.password, 10)
        const user = await context.prisma.user.create({data: {...args, password}})
        const token = jwt.sign({userId: user.id}, APP_SECRET)
        return {
            token,
            user,
        }
    }
async function login(parent, args, context, info){
    const user = await context.prisma.user.findFirst({where: {email: args.email}})
    if(!user){
        throw new Error('No such user found')

    }
    const valid = await bcrypt.compare(args.password, user.password)
    if(!valid){
        throw new Error('Invalid password')

    }
    const token = jwt.sign({userId: user.id}, APP_SECRET)
    return {
        token,
        user,
    }
}
async function vote(parent, args, context, info){
    const userId = getUserId(context)
    const vote = await context.prisma.vote.findUnique({
        where: {
            linkId_userID: {
                linkId: Number(args.linkId),
                userId: userId
            }
        }
    })
    if(Boolean(vote)){
        throw new Error(`Already voted for link ${args.linkId}`)
    }
    const newVote = context.prisma.vote.create({
        data:{
            user: {connect: {id: userId}},
            link: {connect: {id: Number(args.linkId)}},

        }
    })
    context.pubsub.publish("NEW_VOTE", newVote)
    return newVote

}
    module.exports = {
        post,
        updateLink,
        deleteLink,
        login,
        signup,
        vote
    }