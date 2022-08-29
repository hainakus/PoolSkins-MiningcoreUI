import { Router } from "@vaadin/router";

const router = new Router(document.getElementById('outlet'), {baseUrl: '/'} );
router.setRoutes([
  {path: '/',
    animate: true,
    component: 'x-skin-a',
    children: [
      {path: '/', component: 'x-dash'},
      {path: '/miners', component: 'x-chart'},
      {path: '/users/:user', component: 'x-user-profile'},
    ]
  },
  {path: '/firo',
    animate: true,
    component: 'x-skin-a',
    children: [
      {path: '/', component: 'x-dash'},
      {path: '/miners', component: 'x-chart'},
      {path: '/users/:user', component: 'x-user-profile'},
    ]
  }
]);
