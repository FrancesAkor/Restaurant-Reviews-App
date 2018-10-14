const cacheName = 'restaurant-cache-1';
//Save all the files to be cached in an array
const filesToCache = [
	'/',
	'index.html',
	'restaurant.html',
	'css/styles.css',
	'js/dbhelper.js',
	'js/main.js',
	'js/restaurant_info.js',
	'data/restaurants.json',
	'img/1.jpg',
	'img/2.jpg',
	'img/3.jpg',
	'img/4.jpg',
	'img/5.jpg',
	'img/6.jpg',
	'img/7.jpg',
	'img/8.jpg',
	'img/9.jpg',
	'img/10.jpg'
];
/*Listen for the service worker install event.
when it occurs, create a cache and puts all the files to be cached in it.*/
self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(cacheName)
		.then(cache => {
			return cache.addAll(filesToCache);
		})
		.then(() => self.skipWaiting())
	);
});

//On activate, delete old caches
self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys()//Get the names of all the available caches.
		.then(cacheNames => {
			return Promise.all(
				cacheNames.map(cache => {
					if(cache !== cacheName) {
						return caches.delete(cache);
					}
				})
			);
		})
	);
});
//Show available requested cache files while offline
self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request)//This returns a promise for matching request in the cache.
		.then(response => {
			if(response) {
				return response;
			} else { 
				/*If the request is not in the cache, get the request from the server, 
				clone and save it in the cache and then return the fetched response
				*/
				return fetch(event.request)
				.then(response => {
					//Check if the response is valid
					if(!response || response.status !== 200 || response.type !== 'basic') { 
						return response; 
					}
					//Clone response so it would be available to both the browser and the cache
					let clonedResponse = response.clone()
					caches.open(cacheName)
					.then(cache => {
						//Add to cache
						cache.put(event.request, clonedResponse);
					})
					return response;
				})
			}
		})
	);
});
