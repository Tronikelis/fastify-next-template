import Fastify from "fastify";

import fastifyFileRoutes from "@server/plugins/fastifyFileRoutes";
import fastifyNext from "@server/plugins/fastifyNext";

const port = Number(process.env.PORT || 3000);
const dev = process.env.NODE_ENV !== "production";

const fastify = Fastify({
    ajv: {
        customOptions: {
            strict: "log",
            keywords: ["kind", "modifier"],
        },
    },
    logger: true,
    maxParamLength: 500,
    ignoreTrailingSlash: true,
    pluginTimeout: 1000 * 60 * 2,
    trustProxy: !dev,
});

void fastify.register(fastifyFileRoutes, {
    dir: "./routes",
    prefix: "/api/v1",
});

void fastify.register(fastifyNext, {
    next: { dev, dir: "../../client" },
    plugin: { routes: ["/"] },
});

void fastify.listen({ port, host: "0.0.0.0" });
