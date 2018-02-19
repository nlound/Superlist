# Superlist

Simple list. With pictures and descr¡ption!

## Features

- Sort elemtents by drag and drop.
- See how many elements you have in the list at any time!
- You can add, edit or delete items easily!

and...

you dont need to worry about losing data because every change is saved your you without refreshing the page!

Images must be jpg, gif or png of 320px x 320px.
Descriptions must be a maximun of 300 chars long.

### Minimum requirements:
 - [NodeJS 6.10](https://nodejs.org/)
 - NPM 3.10 (part of the NodeJS core)

### First time installation
Open your terminal and navigate to the folder containing gulpfile.js.
If the node_modules folder doesn't exists you will need to install all the dependencies for the first time.

    $ npm install

### Usage
After the node_modules are installed, run the following command to start the Node app.

    $ node server/server


### Development

To edit the CSS use the SCSS file on src/main.scss and run the watcher to compile it:

    $ gulp

And run node app with node-dev 

    $ node-dev server/server

