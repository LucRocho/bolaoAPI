
CREATE USER 'userBolao'@'localhost'  IDENTIFIED BY '';
GRANT  ALL PRIVILEGES ON `dbbolao`.* TO 'userBolao'@'localhost';

CREATE USER 'userBolao'@'%'  IDENTIFIED BY '';
GRANT  ALL PRIVILEGES ON `dbbolao`.* TO 'userBolao'@'%';


-db: user: userBolao, database: dbbolao, password: supersenha123