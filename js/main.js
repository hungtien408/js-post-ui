import axiosClient from './api/axiosClient';

console.log('Hello main.js');

async function main() {
  const response = await axiosClient.get('/posts');
  console.log(response);
}

main();
