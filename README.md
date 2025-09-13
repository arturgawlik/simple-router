### What is it
Very simple regex based node router with parsing body and query params.
### How to 
#### Install
```bash
npm install simple-simple-router
```
#### Use
```javascript
import { createServer } from "node:http";
import ssr from 'simple-simple-router';

createServer(ssr({
    'login': (req, res) => {
        console.log("parsed body: ", req.body)
        console.log("parsed query params: ", req.params)
        res.writeHead(200);
        res.write('yoooo\n');
        res.end();
    }
})).listen(8080);
```

