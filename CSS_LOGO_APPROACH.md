/* Alternative CSS approach - add to globals.css */
.logo {
  width: 40px;
  height: 40px;
  background-image: url('/images/logo.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

@media (min-width: 640px) {
  .logo {
    width: 48px;
    height: 48px;
  }
}

/* Then in your component */
<div className="logo"></div>
