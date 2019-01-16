#!/bin/sh
#Constants
USER="syslog"
PASSWORD="syslog12082018"
DATABASE="syslog"

BACKUPS_FOLDER="/home/node/backups/syslog"

#Remove tmp
date

#Backup of the database
date
echo Backup of the databse
mysqldump -u $USER -p$PASSWORD $DATABASE | gzip > `date +$BACKUPS_FOLDER/$DATABASE.%Y%m%d.%H%M%S.gz`

BACKUP_DATE=$(date +%H-%M-%S-%d-%m-%y)
echo Pack to a archive $BACKUP_DATE
