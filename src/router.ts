import { Router } from "@vaadin/router";

const router = new Router(document.getElementById('outlet'));
router.setRoutes([{
  path: '/',
  animate: true,
  children: [
    {path: '', component: 'x-skin-a'},
    {path: '/background', component: 'x-card'},
    {path: '/users', component: 'x-user-list'},
    {path: '/users/:user', component: 'x-user-profile'},
  ]
}]);
