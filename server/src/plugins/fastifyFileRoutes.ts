import { FastifyInstance, FastifyPluginAsync, HTTPMethods, RouteOptions } from "fastify";
import path from "path";
import glob from "tiny-glob";

interface Opts {
    dir: string;
}

type FileRouteOptions = {
    [K in HTTPMethods]?: Omit<RouteOptions, "method" | "url" | "handler"> & {
        handler: any;
    };
};

export type FastifyFileRouteNormal = FileRouteOptions;
export type FastifyFileRouteFN = (fastify: FastifyInstance) => FileRouteOptions;

interface DynamicImport {
    default: FastifyFileRouteFN | FastifyFileRouteNormal;
}

const normalizeRoute = (route: string) => path.normalize(route).replaceAll("\\", "/");

const fastifyFileRoutes: FastifyPluginAsync<Opts> = async (fastify, { dir }) => {
    const absolute = normalizeRoute(path.resolve(dir));
    const routes = await glob(`${absolute}/**/[!._]*.{js,ts}`);

    const normalizedRoutes = routes.map(route => {
        const imp = normalizeRoute(path.join(process.cwd(), route));

        const segments = normalizeRoute(route).split(".")[0].split("/").slice(1);
        // convert {name} or [name] to :name
        const url = segments.map(segment => {
            // make dynamic routes compatible with fastify
            if (segment.match(/\[|{/)) {
                return ":" + segment.replace(/\[|]|{|}/g, "");
            }
            return segment;
        });

        // if the end segment is "index", then rm it
        if (url[url.length - 1] === "index") {
            url.splice(url.length - 1, 1);
        }

        return {
            // join the modified segments and add a "/" at the start
            // from = auth/[user] or {user}/index
            // to = /auth/:user
            url: "/" + url.join("/"),
            imp,
        };
    });

    const promises = normalizedRoutes.map(async ({ imp, url }) => {
        const routeObj = (await import(imp)) as DynamicImport;
        let normalizedObj = {} as FastifyFileRouteNormal;

        if (typeof routeObj.default === "function") {
            normalizedObj = routeObj.default(fastify);
        } else {
            normalizedObj = routeObj.default;
        }

        Object.entries(normalizedObj).forEach(([method, options]) => {
            fastify.route({
                method: method.toUpperCase() as HTTPMethods,
                url,
                ...options,
            });
        });
    });

    await Promise.all(promises);
};

export default fastifyFileRoutes;
