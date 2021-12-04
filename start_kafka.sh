cd Publisher1
docker build -t cricket-api-publisher-1 .
cd ../Publisher2
docker build -t cricket-api-publisher-2 .
cd ..
docker-compose up --remove-orphans