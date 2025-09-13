/**
 * @import {IncomingMessage, ServerResponse} from 'node:http';
 * @typedef {(req: IncomingMessage & { body: string; params: Record<string, object> }, res: ServerResponse)} Handler 
 * @typedef {Record<string | RegExp, Handler>} RouteConf 
 */

const td = new TextDecoder();

/**
 * @param {RouteConf} routeConf
 */
const sr = (routeConf) => {
    const regexHandler = Object.entries(routeConf).map(([path, handler]) => ({
        path: path instanceof RegExp ? path : new RegExp(path),
        handler
    }))

    return async (req, res) => {
        req.body = await sBodyParse(req);
        req.params = sQueryParse(req.url);
        const handler = regexHandler.find(({ path }) => path.test(req.url))?.handler
        if (handler) {
            handler(req, res)
        } else {
            res.writeHead(404, "Not Found.")
            res.end();
        }
    }
}

/**
 * @param {IncomingMessage} req
 * @returns {Promise<string>}
 */
const sBodyParse = async (req) => {
    const chunks = [];
    for await (const chunk of req) {
        chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks)
    return td.decode(buffer);
}

/**
 * @param {string} path 
 * @returns {Record<string, object>}
 */
const sQueryParse = (path) => {
    const qParams = {};
    const [, qParamsStr] = path.split('?');
    if (qParamsStr) {
        for (const qParamStr of qParamsStr.split('&')) {
            const [qName, qValue] = qParamStr.split('=');
            if (qName && qValue) {
                qParams[qName] = decodeURIComponent(qValue);
            }            
        }
    }
    return qParams;
}

export default sr;
