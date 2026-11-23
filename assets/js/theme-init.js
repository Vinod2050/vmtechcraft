/* Applies the saved colour theme before the page paints (prevents a flash of the default theme).
   Loaded as a normal blocking script in <head> — kept external so the Content-Security-Policy
   can stay at script-src 'self' with no 'unsafe-inline'. */
try {
  var t = localStorage.getItem('vm-theme');
  if (t === 'forest') document.documentElement.removeAttribute('data-theme');
  else if (t) document.documentElement.setAttribute('data-theme', t);
} catch (e) {}
