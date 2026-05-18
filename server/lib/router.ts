import { IncomingMessage } from 'node:http';

export type RouteHandler = (req: IncomingMessage, res: any, params: Record<string, string>) => Promise<void>;

interface Route {
  method: string;
  pattern: RegExp;
  paramNames: string[];
  handler: RouteHandler;
}

export class Router {
  private routes: Route[] = [];

  add(method: string, path: string, handler: RouteHandler) {
    const paramNames: string[] = [];
    const regexSource = path.replace(/:([^/]+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });
    const pattern = new RegExp(`^${regexSource}$`);
    this.routes.push({ method: method.toUpperCase(), pattern, paramNames, handler });
  }

  async handle(req: IncomingMessage, res: any): Promise<boolean> {
    const { method, url } = req;
    const path = new URL(url || '/', `http://${req.headers.host}`).pathname;

    for (const route of this.routes) {
      if (route.method === method) {
        const match = path.match(route.pattern);
        if (match) {
          const params = route.paramNames.reduce((acc, name, index) => {
            acc[name] = match[index + 1];
            return acc;
          }, {} as Record<string, string>);
          await route.handler(req, res, params);
          return true;
        }
      }
    }
    return false;
  }
}
