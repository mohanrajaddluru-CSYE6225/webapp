const StatsD = require('node-statsd');

const statsd = new StatsD({
    host: '127.0.0.1',
    port: 8125, // Default StatsD port
});

const logRequestCount = (req, res, next) => {
  const routePath = req.baseUrl + req.route.path;
  const idPattern = /:[a-zA-Z0-9\-_]+/;
  const metricConfig = {
    'GET': {
      '/healthz/' : 'Database Health Check API',
      '/v2/assignments/': 'Get All Assignments API',
      '/v2/assignments/:id': 'Get Assignment By ID API',
    },
    'POST': {
      '/v2/assignments/': 'Create Assignment API',
      '/v2/assignments/:id/submission': 'Assignment Submission API'
    },
    'PUT': {
      '/v2/assignments/:id': 'Update Assignment API',
    },
    'DELETE': {
      '/v2/assignments/:id': 'Delete Assignment API',
    },
  };

  const method = req.method;
  let sanitizedRoutePath = routePath;
  if (idPattern.test(routePath)) {
      sanitizedRoutePath = routePath.replace(idPattern, ':id');
  }
console.log(sanitizedRoutePath);
  const metricName = metricConfig[method] && metricConfig[method][sanitizedRoutePath];
console.log(`incremented ${metricName}`)
  if (metricName) {
    statsd.increment(`${metricName}`);
  }
  next();
};


module.exports = logRequestCount;