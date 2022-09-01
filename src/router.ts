import { Router } from "@vaadin/router";

const router = new Router(document.getElementById('outlet'), {baseUrl: '/'} );
router.setRoutes([
  {path: '/',
    animate: true,
    component: 'x-skin-a',
    children: [
      {path: '/', component: 'x-dash'},
      {path: '/connect', component: 'x-connect'},
      {path: '/wallet', component: 'x-chart'},
      {path: '/payments', component: 'x-payments'},
    ]
  },
  {path: '/firo',
    animate: true,
    component: 'x-skin-a',
    children: [
      {path: '/', component: 'x-dash'},
      {path: '/connect', component: 'x-connect'},
      {path: '/wallet', component: 'x-chart'},
      {path: '/payments', component: 'x-payments'},
    ]
  },
  {path: '(.*)', component: 'x-not-found'},
]);
