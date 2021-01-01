const {ApolloServer} = require('apollo-server');
const fs = require('fs');
const path = require('path')

let links = [
    {
        id: 'link-0',
        url: 'www.howtographql.com',
        description: 'Full stack tutorial for graphql'
    }
]


// 1
let idCount = links.length
const resolvers = {
    Query: {
        info: () => 'This is API for hackernews Clone',
        feed: () => links,
        link: (parent, args) =>{
           let link = links.find(lnk => lnk.id == args.id)    
           return link
        },
    },
    Mutation: {
        // 2
        post: (parent, args) => {
            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url
            }
            links.push(link)
            return link
        },
        updateLink: (parent, args) => {
            let link = links.find(lnk => lnk.id == args.id)    
            const index = links.findIndex(lnk => lnk.id == args.id)    
            if(args.description){
                link.description = args.description
            }
            if(args.url){
                link.url = args.url
            }
            links[index] = link;
            return link;

        },
        deleteLink: (parent, args) => {
            let link = links.find(lnk => lnk.id == args.id)    
            if(link){
                let newlinks = links.filter(lnk => lnk.id != args.id)    
                const index = links.findIndex(lnk => lnk.id == args.id) 
                links = newlinks   
            }
            else{
                return
            }

        }
    }
}

// 3 
const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers
})

server.listen()
.then(({url}) => 
    console.log(`Server is running on ${url}`)
)   