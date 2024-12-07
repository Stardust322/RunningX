#! /bin/bash
file_name=$1
if [ ! -d $file_name ]; then
    mkdir $file_name
fi
cd $file_name

for((i=0;i<5;i++)); do
    mkdir "file$i"
    touch "file$i.txt"
    cd "file$i"
    ln -s "../file$i.txt" "file$i.txt"
    cd .. 
done
exit 0