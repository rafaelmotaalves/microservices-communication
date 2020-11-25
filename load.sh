
for i in {1..1000}; do
  curl --request POST --header "Content-Type: application/json" --data "{\"name\": \"teste$i\" }" http://192.168.49.2:30003/shipping
done
