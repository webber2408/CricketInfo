cd client
docker build -t cricket-client .
cd ..
docker build -t cricket-api .
cd Publisher1
docker build -t cricket-api-publisher-1 .
cd ../Publisher2
docker build -t cricket-api-publisher-2 .
cd ../Consumer
docker build -t consumer-1 .
cd ../Publisher3
docker build -t cricket-api-publisher-3 .
cd ..
docker-compose up --remove-orphans