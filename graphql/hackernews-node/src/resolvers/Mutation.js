const { buildSchemaFromTypeDefinitions } = require("apollo-server");
const bcrypt= require('bcryptjs')
const jwt= require('jsonwebtoken')
const {APP_SECRET} = require('../utils')
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
    module.exports = {
        post,
        updateLink,
        deleteLink,
        login,
        signup
    }