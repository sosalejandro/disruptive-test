#!/bin/bash

echo "Waiting for MongoDB to start on host.docker.internal:27017..."

until mongosh --quiet --host host.docker.internal --port 27017 --eval "db.runCommand({ ping: 1 }).ok" | grep 1 &>/dev/null; do
  sleep 1
done

echo "MongoDB has started successfully"

echo "Initiating MongoDB replica set..."

mongosh -u root -p root --host host.docker.internal --port 27017 --eval "
  rs.initiate({
    _id: 'rs0',
    members: [
      {
        _id: 0,
        host: 'host.docker.internal:27017'
      },
      {
        _id: 1,
        host: 'host.docker.internal:27018'
      },
      {
        _id: 2,
        host: 'host.docker.internal:27019'
      }
    ]
  })
"