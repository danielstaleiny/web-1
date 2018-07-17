![together](together-logo.png)

The together project is an [IndieWeb](http://indieweb.org)
environment for reading, discovering, and interacting with content. You might
call it a [reader](http://indieweb.org/reader).

<div>
<a href="https://cleverdevil.io/s/WEGNzGQDyX.jpg">
  <img width="250" align="left" src="https://cleverdevil.io/s/WEGNzGQDyX.jpg">
</a>
<a href="https://cleverdevil.io/s/5wGwiSMpSA.jpg">
  <img width="250" align="left" src="https://cleverdevil.io/s/5wGwiSMpSA.jpg">
</a>
<a href="https://cleverdevil.io/s/dMFEtVZ4Mh.jpg">
  <img width="250" align="left" src="https://cleverdevil.io/s/dMFEtVZ4Mh.jpg">
</a>
<br>
<a href="https://cleverdevil.io/s/LDB4IBtNaD.jpg">
  <img width="250" align="left" src="https://cleverdevil.io/s/LDB4IBtNaD.jpg">
</a>
<a href="https://cleverdevil.io/s/kBOkpX8GM5.jpg">
  <img width="250" src="https://cleverdevil.io/s/kBOkpX8GM5.jpg">
</a>
</div>

---

Together is a [React](https://facebook.github.io/react/) based application. To
use it, you'll need a website that supports
[Micropub](https://indieweb.org/Micropub),
[IndieAuth](https://indieweb.org/IndieAuth) and
[Microsub](https://indieweb.org/Microsub).

## Running locally in development mode

You'll need `node` and `npm` installed. Once you have
them, you can simply check out the repository and run `npm install`, followed
by `npm run start`. The server part runs on port 10008 by default
and a hot reloading frontend is available on port 3000 (ideal for frontend development)

## Running locally in production mode

First, generate a production package:

- `npm run build`

Then, run the production package at port 8000:

- `/usr/bin/node server --port 8000`

---

Want to join in and get involved? Open some issues or submit PRs!
