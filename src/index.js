const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const exphbs = require("express-handlebars");
const http = require("http");
const path = require("path");

const app = express();

app.set("views", path.join(__dirname, "views"));

const mimetypes = {
  'html': 'text/html',
  'css': 'text/css',
  'js': 'text/javascript',
  'png': 'image/png',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpg'
};

const hbs = exphbs.create({
  defaultLayout: "main",
  layoutsDir: path.join(app.get("views"), "layouts"),
  partialsDir: path.join(app.get("views"), "partials"),
  extname: ".hbs",
  helpers: {
    ifeq: function(a, b, options) {
      if (a == b) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    ifnoteq: function(a, b, options) {
      if (a != b) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    firstL: function(options) {
      return options.charAt(0);
    }
  }
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

// Middleware
app.use(morgan("tiny")); //Morgan
app.use(cors()); // cors
app.use(express.json()); // JSON
app.use(express.urlencoded({ extended: false })); //urlencoded

// Routes
app.use(require("./routes"));

const server = http.createServer(app);

app.set("port", process.env.PORT || 4000);

server.listen(app.get("port"), () => {
  console.log("server on port", app.get("port"));
});
