import '@fastify/cookie'

declare module 'fastify' {
  interface FastifyRequest {
    cookies: {
      [key: string]: string | undefined
    }
  }
}
