import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    /** Document title and default page heading. */
    title?: string;
    /** Shell to render around the route. Defaults to `admin`. */
    layout?: "admin" | "auth" | "blank";
    /** Breadcrumb labels after "Home". The last entry is the current page. */
    breadcrumb?: string[];
  }
}
