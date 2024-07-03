import Route from "./Route.js";
import NotFoundPage from "../Pages/NotFound/NotFound.js";

export default class Router {
  constructor(routes) {
    this.routes = routes;
    this.notFound = new Route("Not Found", new NotFoundPage());
  }

  loadRoute(url) {
    let route = this.routes.find((r) => r.route == "/" + url);
    route = route ? route : this.notFound;
    return route;
  }
}
