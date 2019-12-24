#!/bin/sh
ssh-keygen -t rsa -b 4096 -m PEM -f certificates/access.key -P ""
openssl rsa -in certificates/access.key -pubout -outform PEM -out certificates/access.pem

ssh-keygen -t rsa -b 4096 -m PEM -f certificates/refresh.key -P ""
openssl rsa -in certificates/refresh.key -pubout -outform PEM -out certificates/refresh.pem

# clear
rm certificates/access.key.pub
rm certificates/refresh.key.pub