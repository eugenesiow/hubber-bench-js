for ((n=$1;n<$2;n++))
do
	node mqtt-pi-smart.js $n $3 $4 $5
done
