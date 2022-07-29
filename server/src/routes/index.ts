import { RouteHandler } from "fastify";

import { FastifyFileRouteNormal } from "@server/plugins/fastifyFileRoutes";

const handler: RouteHandler = () => {
    return { hello: "world" };
};

export default {
    GET: {
        handler,
    },
} as FastifyFileRouteNormal;
