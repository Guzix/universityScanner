#!/bin/bash

echo "Recreating Db"
./recreateProdDb.sh

echo "Building"
./build.sh

echo "Deploying"
./deployProd.sh


