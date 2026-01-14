subnett: 10.12.11.0/24
gateway: 10.12.11.1

Både db-server og node-server har brannmur regler som beskytter mot innkommende traffikk fra andre subnett enn 10.12.11.0/24 og 10.12.99.0/24.

db-server:
servername: q-db-server
IP: 10.12.11.110

node-server:
servername: q-node-server
IP: 10.12.11.111

dns-server:
servername: maria-ns
IP: 10.12.11.10