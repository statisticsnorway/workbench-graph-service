# workbench-graph-service
A service that converts data model dependency graphs into a dot file for use with Graphviz and other visualizers

## Getting started

- Add an environment variable to the ``.env`` file, e.g: 
```NODE_ENV=development```

- Start the app with ``yarn run start:dev``

## CORS
If you plan to access this application from another application on the same server, you need to add the url (inlcuding http(s)) and port to 
the env variable CORS_WHITELIST in the aforementioned ``.env`` file, e.g:
```
CORS_WHITELIST=http://localhost:3000
``` 
