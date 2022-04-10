import { Router } from "@vaadin/router";

const router = new Router(document.getElementById('outlet'));
router.setRoutes([
  {path: '/',
    animate: true,
    component: 'x-skin-a',
    children: [
      {path: '/', component: 'x-dash'},
      {path: '/users', component: 'x-user-list'},
      {path: '/users/:user', component: 'x-user-profile'},
    ]
  }
]);
