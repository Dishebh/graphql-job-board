const fs = require('fs')
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');

const { ApolloServer, gql } = require('apollo-server-express');

const db = require('./db');

const port = 9000;
const jwtSecret = Buffer.from('Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt', 'base64');

const app = express();
app.use(cors(), bodyParser.json(), expressJwt({
  secret: jwtSecret,
  credentialsRequired: false
}));


// Construct a schema, using GraphQl schema language 
const typeDefs = gql(fs.readFileSync('./schema.graphql', { encoding: 'utf8' }));

// Provide resolver functions for your schema fields
const resolvers = require('./resolvers')

const context = ({ req }) => ({ user: req.user && db.users.get(req.user.sub) })

const apolloServer = new ApolloServer({ typeDefs, resolvers, context })

apolloServer.applyMiddleware({app, path: '/graphql'});

app.post('/login', (req, res) => {
  const {email, password} = req.body;
  const user = db.users.list().find((user) => user.email === email);
  if (!(user && user.password === password)) {
    res.sendStatus(401);
    return;
  }
  const token = jwt.sign({sub: user.id}, jwtSecret);
  res.send({token});
});

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:9000${apolloServer.graphqlPath}`)
);