#!/bin/bash

export PGPASSWORD="mlsystem#12345#ml"

pg_dump -U postgres production > local_dump.sql

#psql -U postgres -c 'DROP DATABASE production;'
#psql -U postgres -c 'CREATE DATABASE production;'
#psql -U postgres -d production -f prod_dump.sql
