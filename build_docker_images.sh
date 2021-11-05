cd client
docker build -t cricket-client .
cd ../Publisher1
docker build -t cricket-api-publisher-1 .
cd ../Publisher2
docker build -t cricket-api-publisher-2 .
cd ../Publisher3
docker build -t cricket-api-publisher-3 .
cd ../server1
docker build -t broker-node-1 .
cd ../server2
docker build -t broker-node-2 .
cd ../server3
docker build -t broker-node-3 .
cd ..