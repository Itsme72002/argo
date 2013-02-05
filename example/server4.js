var argo = require('../');
var cors = require('./cors');
var agent = require('webkit-devtools-agent');

argo()
  .use(cors)
  .get('/outer', function(addHandler) {
    addHandler('request', function(env, next) {
      env.response.body = 'Outer scope!';
      next(env);
    });
  })
  .map('/web', function(web) {
    web 
      .use(function(addHandler) {
        addHandler('response', function(env, next) {
          env.response.headers['X-Stuff'] = 'Yep';
          next(env);
        });
      })
      .get('/greeting', function(addHandler) {
        addHandler('request', function(env, next) {
          env.response.body = 'Hello, world!';
          next(env);
        }); 
      });
  })
  .listen(process.env.PORT || 3000);

  console.log(process.pid);

/*var memwatch = require('memwatch');
memwatch.on('stats', function(d) {
  console.log('postgc:', d);
});

memwatch.on('leak', function(d) {
  console.log('LEAK:', d);
  process.exit(0);
});*/