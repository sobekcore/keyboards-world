# Keyboards World
Keyboards World is a example e-commerce website to improve my front-end skills. It serves informational and store-like purposes. It's design is modern and uses very few color scheme only. Made with the intention to be flexible and convenient.

## How it's made?
Keyboards World is initially made with plain **`HTML`**, **`CSS`** and **`JavaScript`**. Then fetching products is done with the help of **`Contentful`** CMS and enviroment variables, thanks to that is very easy to add new products in seconds in the CMS. Some of the icons are used with Font Awesome, which is very simple solution of easy icon usage. Then whole project is bundled and optimized with **`Webpack`** to work as fast and as good as possible. Also some of the work is optimized and automated with **`npm scripts`**. You can launch development enviroment, build, test your live deployments before final production version, and finally push it to final state. Overall the project is made in a way to be simple, clear, and really fast.

## How to run it?
You just download the project and launch local Webpack Dev Server or http-server of any kind and run it in the browser. To use Contentful change **`CONTENTFUL_SPACE_ID`** and **`CONTENTFUL_ACCES_TOKEN`** values in .env file. Alternatively use attached JSON file with all the products listed in a right way, and uncomment 41-43 **`store.js`** file lines.
