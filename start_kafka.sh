docker-compose down
cd Publisher1
docker build -t cricket-api-publisher-1 .
cd ../Publisher2
docker build -t cricket-api-publisher-2 .
cd ../Publisher3
docker build -t cricket-api-publisher-3 .
cd ../Consumer
docker build -t consumer-1 .
cd ..
docker-compose up --remove-orphans