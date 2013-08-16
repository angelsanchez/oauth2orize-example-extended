oauth2orize-example-extended
===========================

Full oauth2orize example with 2 applications:
* __server__: oAuth2 service provider
* __client__: oAuth2 client consumer

To execute the example:
* Install all nodejs modules: `npm install` on `/server` and `/client`

* Run the server (localhost:3000):

```
cd server
node app.js
```

* Run the client (localhost:8080):

```
cd client
node app.js
```

* Open a web browser and visit: `http://localhost:8080/login` and the oAuth2 flow will start. First the user log in the oAuth2 server, after must allow the consumer application's grants.

There are two services that consume protected services:

* Returns basic user information:
`http://localhost:8080/userinfo`

```json
{
  "provider": "appexample",
  "id": "1",
  "name": "Bob Smith",
  "accessToken": "YhsKDUxkYDvrcgcPvtjeHnEjjmpzQPvz88oUtRdF13kx9IoC64j5buIJXoUELuewAc8eD0Q3fiBiufmLbj8KNFc1PR9dv3EFJcgRUPMuTrepddhvmOmeAHjDDtSLvbF04550rJ5AuOJDM6Yaqz2a3Ya0w32dZYOxww11peTQ3KooqpjRnXpzICQG25V428QQORwQwZkzmUxOcgR5TyylXUVSUhS36mhpyKEIEavCRdtc2bSBxCNijzOEU7c2e1cR"
}
```

* Returns all user personal data:
`http://localhost:8080/userfullinfo`
```json
{"id":"1","username":"bob","password":"secret","name":"Bob Smith","phoneNumber":"785-873-3930","email":"bob@email.com","address":"968 Sherman Street, Everest","birthday":"02-02-1992"}
```

You can change the scopes in `client/app.js`:

```js
app.get('/auth/appexample',
  passport.authenticate('appexample', { scope: 'userinfo userfullinfo' }),
  function(req, res){
    console.log("Authorizating...")
  }
);
```
