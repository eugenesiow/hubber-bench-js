for ((n=$1;n<$2;n++))
do
	node pi.js $n $3 $4
done
