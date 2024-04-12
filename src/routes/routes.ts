import { AESEncrypt } from 'src/vendor/interfaces.js'
import readJson, { Uws } from '../utils/uws.js'
import VOP from '../lib/voprotocol.js'
import Validate from '../utils/validator.js'
import user from '../schemes/user.js'
import token from '../schemes/token.js'
import Generator from '../utils/randomGenerator.js'
import { rdb } from '../utils/redis.js'

export default function Routes() {

  Uws.app.get('/*', (res, req) => {

    console.log(req.getUrl())
  
    res.writeStatus('200 OK').end('Your URL '+req.getUrl())
    
  })
  
  Uws.app.get('/e/:Text', async (res, req) => {

    const text = req.getParameter(0)

    const data : AESEncrypt = {
      Key: process.env.AES_32,
      Text: text,
      Vi: new VOP().iv(32)
    }

    res.writeStatus('200 OK').end(new VOP({action: 'encrypt'}).data(data).toString())

  })

  Uws.app.post('/user/create', (res, req) => {

    readJson(res, async (obj) => {

      res.writeHeader('Content-type', 'application/json')

      if(!obj.email || new Validate({must: 'email'}).condition(obj.email) === false)
        return res.cork(() => { res.writeStatus('400').end(JSON.stringify({ state: false, err: '' })) })
      if(!obj.password || obj.password.length < 12)
        return res.cork(() => { res.writeStatus('400').end(JSON.stringify({ state: false, err: '' })) })

      const tryToGetUser = await user.findOne({ email: obj.email })
      if(tryToGetUser) {
        return res.cork(() => { res.writeStatus('400').end(JSON.stringify({ state: false, err: 'User already exsist' })) })
      }

      const unicode = new VOP().iv(32)
      const newToken = Generator(32)

      const data : AESEncrypt = {
        Key: process.env.AES_32,
        Text: obj.password,
        Vi: unicode
      }

      const addUser = new user({
        email: obj.email,
        password: new VOP({action: 'encrypt'}).data(data).toString(),
        unicode,
        role: 'default',
        createdAt: Date.now(),
        createdAtCode: Date.now()
      })
      await addUser.save()

      const getUser = await user.findOne({ email: obj.email })
      const addToken = new token({
        owner_id: getUser._id,
        token: newToken,
        createdAt: Date.now(),
        createdAtCode: Date.now()
      })
      await addToken.save()


      return res.cork(() => { 
        res.writeStatus('200 OK').end(JSON.stringify({
          state: true,
          token: newToken
        }))  
      })

    }, {})

  })

  Uws.app.post('/user/auth', (res, req) => {

    res.onAborted(() => {
      res.aborted = true
    })

    readJson(res, async (obj) => {

      res.writeHeader('Content-type', 'application/json')

      if(!obj.email || new Validate({must: 'email'}).condition(obj.email) === false)
        return res.cork(() => { res.writeStatus('400').end(JSON.stringify({ state: false, err: '' })) })
      if(!obj.password || obj.password.length < 12)
        return res.cork(() => { res.writeStatus('400').end(JSON.stringify({ state: false, err: '' })) })

      new Promise(async (a, d) => {

        const tryToGetUser = await user.findOne({ email: obj.email })
        if(!tryToGetUser) {
          d(res.cork(() => { res.writeStatus('400').end(JSON.stringify({ state: false, err: '' })) }))
        }

        a(tryToGetUser)
      })
      .then((getUser: any | undefined) => {

        new Promise((a, d) => {

          if(new VOP({action: 'decrypt'}).data({
            Text: getUser.password,
            Key: process.env.AES_32,
            Vi: getUser.unicode
          }) != obj.password) {
            d(res.cork(() => { res.writeStatus('400').end(JSON.stringify({ state: false })) }))
          }

          a(getUser)
        })
        .then(async (getUser: any | undefined) => {

          const conditionToken = await token.findOne({ owner_id: getUser._id.toString() })
          let responseToken : string

          if(conditionToken) responseToken = conditionToken.token

          else {
            const generatedToken = Generator(32)
            const addToken = new token({
              owner_id: getUser._id,
              token: generatedToken,
              createdAt: Date.now(),
              createdAtCode: Date.now()
            })
            await addToken.save()
    
            responseToken = generatedToken
          }
    
          if(!res.aborted) {
            return res.cork(() => { 
              res.writeStatus('200 OK').end(JSON.stringify({ state: true, token: responseToken }))  
            })
          }

        })
        .catch(e => e)

      })
      .catch(e => e)


    })

  })

  Uws.app.get('/test2', async (res, req) => {

    res.onAborted(async () => {
      res.aborted = true
    })
    
    new Promise(async (a, d) => {
      await rdb.set('user', JSON.stringify({name: "Cavid"}), { 'EX': 25 })
      const user = await rdb.get('user')
      a(user)
    }).then(user => {
      if(!res.aborted)
      res.cork(() => { console.log(user); res.end() })
    })
    .catch(e => console.error(e))
    
  })

}