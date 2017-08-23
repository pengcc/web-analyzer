# A simple Web-Application for Analyzing Web-Sites

### Frontend

Used [mustache.js](http://github.com/janl/mustache.js) to build the frontend templates. Mustache is a logic-less template syntax. Simple data driven and easy to separate from the backend. Two Mustache templates were created for the analysis form and analysis report.

Used grunt sass for the efficient styling and ES6 new features like arrow function to write the clean Javascript code. Used Webpack and babel-polyfill to make the ES6 code running on the old browsers.


### Backend

The server just needs to provide the data for the template render. Used express as the static server and cheerio to build a simple document parser. The document parser provide serval methods that get the desired data.


### Run
1. There are two environments DEV and PROD configurable in server.js.
2. Server serves the static files under '/dest' for the DEV and '/build' for PROD.
3. Use ```npm install``` to install all the dependent packages and then use ```node server``` to run the server.
4. The server listens on port '3000' configurable in server.js.

### TODO
Due to the limited time, there are a few issues that need to be fixed.
1. On the server side there could be a few bugs, that need to be tested and fixed. e.g. how to detect inaccessible links or how determine if a page contains a login form. For now just on the assumption that login form has only one input element with the property 'type=password'.
2. On the client side need to optimize the responsive design.
