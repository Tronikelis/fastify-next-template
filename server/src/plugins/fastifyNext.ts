import { FastifyPluginAsync, FastifyReply, FastifyRequest, HTTPMethods } from "fastify";
import Next from "next";

type NextOptions = Parameters<typeof Next>[0];

type Route = string | { path: string; methods: HTTPMethods[] };

interface Opts {
    next: NextOptions;
    plugin: {
        routes: Route[];
    };
}

const nextAssetRoutes = ["/__nextjs_original-stack-frame", "/_next/*"];

const fastifyNext: FastifyPluginAsync<Opts> = async (fastify, opts) => {
    const next = Next(opts.next);
    const nextHandle = next.getRequestHandler();

    const handler = (req: FastifyRequest, reply: FastifyReply) => {
        // was in the official fastify/next integration
        // sets custom fastify headers, something like that
        for (const [key, value] of Object.entries(reply.getHeaders())) {
            reply.raw.setHeader(key, value as any);
        }

        return nextHandle(req.raw, reply.raw);
    };

    await next.prepare();

    fastify.addHook("onClose", () => next.close());

    opts.plugin.routes.forEach(route => {
        const isRouteString = typeof route === "string";

        const url = isRouteString ? route : route.path;
        const method = isRouteString ? "GET" : route.methods;

        fastify.route({ url, method, handler });
    });

    nextAssetRoutes.forEach(url => {
        fastify.route({ url, method: "GET", handler });
    });
};

export default fastifyNext;
