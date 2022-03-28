import { Router } from "@vaadin/router";

const router = new Router(document.getElementById('outlet'));
router.setRoutes([{
  path: '/',
  animate: true,
  children: [
    {path: '', component: 'x-skin-a'},
    {path: '/image-:size(\\d+)px', component: 'x-image-view'},
    {path: '/users', component: 'x-user-list'},
    {path: '/users/:user', component: 'x-user-profile'},
  ]
}]);
