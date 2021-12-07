# docker-compose down
cd Publisher1
docker build -t cricket-api-publisher-1 .
cd ../Publisher2
docker build -t cricket-api-publisher-2 .
cd ../Publisher3
docker build -t cricket-api-publisher-3 .
cd ../client
docker build -t cricket-client .
cd ..
docker build -t cricket-api .
docker-compose up --remove-orphans