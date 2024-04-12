import readJson, { Uws } from '../utils/uws.js'
import userRole from '../schemes/userRole.js'

export default function adminRoutes() {

  Uws.app.post('/admin/role/create', (res, req) => {

    readJson(res, async (obj) => {

      res.writeHeader('Content-type', 'application/json')

      if(!obj.name)
        return res.cork(() => { res.writeStatus('400').end(JSON.stringify({ state: false, err: 'name' })) })
      if(!obj.limits)
        return res.cork(() => { res.writeStatus('400').end(JSON.stringify({ state: false, err: 'limits' })) })

      const tryToGetUser = await userRole.findOne({ name: obj.name })
      if(tryToGetUser) {
        return res.cork(() => { res.writeStatus('400').end(JSON.stringify({ state: false, err: 'Role already exsist' })) })
      }

      const newRole = new userRole({
        name: obj.name,
        limit: { group: obj.limits.group, channel: obj.limits.channel },
        createdAt: Date.now(),
        createdAtCode: Date.now()
      })
      await newRole.save()


      res.cork(() => { 
        res.writeStatus('200 OK').end(JSON.stringify({
          state: true
        }))  
      })

    }, {})

  })


}