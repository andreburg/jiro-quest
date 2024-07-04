import NotFoundPage from "../pages/not-found/not-found-page.js";
import Route from "./route.js";

export default class Router {
  constructor(routes) {
    this.routes = routes;
    this.notFound = new Route("Not Found", new NotFoundPage());
  }

  loadRoute(redir) {
    let route = this.routes.find((r) => r.route == redir.route);
    route = route ? route : this.notFound;
    return route;
  }
}
