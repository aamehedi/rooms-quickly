module.exports = {
  port: 5000,
  baseUrl: 'http://localhost',
  database: 'mongodb://localhost/rooms_quickly',
  redisURL: 'redis://127.0.0.1:6379',
  seed: {
    number_of_rooms: 10,
    number_of_partners: 10
  }  
};
