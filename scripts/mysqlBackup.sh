#!/bin/sh
#Constants
USER="syslog"
PASSWORD="syslog12082018"
DATABASE="syslog"


BACKUPS_FOLDER="/home/node/backups/syslog"

#Remove tmp
date
echo "remove tmp folder $TMP_FOLDER"
rm -rf $TMP_FOLDER
mkdir $TMP_FOLDER


#Backup of the database
date
echo Backup of the databse
mysqldump -u $USER -p $PASSWORD $DATABASE | gzip > `date +BACKUPS_FOLDER/$DATABASE.%Y%m%d.%H%M%S.gz`

#Backup of the photos
date
echo Backup of the images
cp -pPR $PHOTOS_FOLDER $TMP_FOLDER/"img"
#Pack to a archive
date

BACKUP_DATE=$(date +%H-%M-%S-%d-%m-%y)
echo Pack to a archive $BACKUP_DATE

rm -rf $TMP_FOLDER