import sr from './index.js';
import { test } from 'node:test';
import { createServer } from 'node:http';
import assert from 'node:assert';

test('should call proper handler with parsed body and query params', async (t) => {
    let server;
    await new Promise((res) => {
        server = createServer(sr({
            'some/test/path': (req, res) => {
                assert.equal(req.body, 'this is body');
                assert.deepEqual(req.params, { a: 'this is param' });
                res.end();
            }
        }));
        server.listen(1234).on('listening', res);
    });
    await fetch(`http://localhost:1234/some/test/path?a=${decodeURIComponent('this is param')}`, { body: 'this is body', method: 'POST' });
    server.close();
});
