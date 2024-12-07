#! /bin/bash
file_name=$1
if [ ! -d $file_name ]; then
    mkdir $file_name
    for((i=0;i<5;i++)); do
        echo -n "file$i.txt "
    done
    echo "$file_name.tar"
fi
cd $file_name

for((i=0;i<5;i++)); do
    touch "file$i.txt"
done
mkdir $file_name
cd $file_name

for((i=0;i<5;i++)); do
    touch "file$i.txt"
done
tar -cvf $file_name.tar file0.txt file1.txt file2.txt file3.txt file4.txt
new_folder=files_extracted
mkdir $new_folder
tar -xf files.tar -C $new_folder
exit 0