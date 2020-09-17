routes = [
  {
    path: '/',
    url: './index.html',
  },
  {
    path: '/signup',
    url: './signup.html',
  },
  {
    path: '/login',
    url: './login_screen_start_app.html',
  },
  {
    path: '/venue_info/',
    url: './pages/venue_info.html',
  },
  {
    path: '/form/',
    url: './pages/form.html',
  },
  {
    path: '/apply_leave/',
    url: './pages/apply_leave.html',
  },
  {
    path: '/chat/',
    url: './pages/chat.html',
  },
 
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
