import { Server, staticMiddleware } from '@/node';

const app = new Server();

// 允许访问的文件类型
const fileTypes: Record<string, string> = {
  html: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
  ts: 'application/javascript',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  json: 'application/json',
  xml: 'application/xml',
};

// app.use(send({ fileTypes }))
app.use(staticMiddleware());

app.listen(8088, () => {
  console.log(`Server port is http://localhost:8088`);
});
