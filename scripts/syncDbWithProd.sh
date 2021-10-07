#!/bin/bash

echo "Downloading Production DB"
./getProdDb.sh

echo "Importing Production DB"
./importProdDump.sh

