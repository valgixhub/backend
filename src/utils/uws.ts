import { App, DEDICATED_COMPRESSOR_3KB } from 'uWebSockets.js'

// uWebSockets
export const Uws = {

    app: App(),
    dc3kb: DEDICATED_COMPRESSOR_3KB

}

/**
 * 
 * @example
 *     readJson(res, (obj) => {
 *       res.writeHeader('Content-type', 'application/json')
 *       res.end(JSON.stringify(obj))
 *     }, () => {
 *       console.log('Invalid JSON or no data at all!')
 *     })
 */

export default function readJson(res, cb, err?) {
    let buffer : Buffer | null

    new Promise<void>((a, d) => {
      res.onData((ab, isLast) => {
        let chunk = Buffer.from(ab)
        if (isLast) {
          let json
          if (buffer) {
            try {
              json = JSON.parse(Buffer.concat([buffer, chunk]).toString());
            } catch (e) {
              return res.endWithoutBody(0, true)
            }
            cb(json)
          } else {
            try {
              json = JSON.parse(chunk.toString())
            } catch (e) {
              return res.endWithoutBody(0, true)
            }
            cb(json)
          }
        } else {
          if (buffer) {
            buffer = Buffer.concat([buffer, chunk])
          } else {
            buffer = Buffer.concat([chunk])
          }
        }
      });
      a()
    })
    .catch(e => console.error(e))
  
    res.onAborted(err)
}