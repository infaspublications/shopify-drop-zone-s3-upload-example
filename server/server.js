import "@babel/polyfill"
import dotenv from "dotenv"
import "isomorphic-fetch"
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth"
import graphQLProxy, { ApiVersion } from "@shopify/koa-shopify-graphql-proxy"
import Koa from "koa"
import next from "next"
import Router from "koa-router"
import bodyParser from "koa-bodyparser"
import session from "koa-session"
import { uploadImage, uploadCSV } from "./handlers/index"
dotenv.config()
const port = parseInt(process.env.PORT, 10) || 8081
const dev = process.env.NODE_ENV !== "production"
const app = next({
  dev,
})

const handle = app.getRequestHandler()
const { SHOPIFY_API_SECRET, SHOPIFY_API_KEY, SCOPES } = process.env
app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()
  server.use(
    session(
      {
        sameSite: "none",
        secure: true,
      },
      server
    )
  )
  server.use(bodyParser())
  server.keys = [SHOPIFY_API_SECRET]
  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET,
      scopes: [SCOPES],

      async afterAuth(ctx) {
        //Auth token and shop available in session
        //Redirect to shop upon auth
        const { shop, accessToken } = ctx.session
        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
        })
        ctx.redirect("/")
      },
    })
  )
  server.use(
    graphQLProxy({
      version: ApiVersion.October19,
    })
  )
  router.get("/api/upload-image", verifyRequest(), async (ctx) => {
    const url = await uploadImage(ctx.query)
    ctx.res.statusCode = 200
    ctx.res.setHeader("Content-Type", "application/json")
    ctx.res.end(JSON.stringify({ url: url }))
  })
  router.get("*", verifyRequest(), async (ctx) => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
    ctx.res.statusCode = 200
  })

  server.use(router.allowedMethods())
  server.use(router.routes())
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})
