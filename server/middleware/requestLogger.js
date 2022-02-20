module.exports = (request, response, next) => {
  console.log('---------------------');
  console.log('Method: ', request.method);
  console.log('Path: ', request.path);
  console.log('Body: ', request.body);
  console.log('Session: ', request.session);
  console.log('---------------------');
  next();
}