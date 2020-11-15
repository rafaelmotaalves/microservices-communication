package works.weave.socks.shipping.configuration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.RoutingKafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.util.concurrent.ListenableFutureCallback;

@Component
class KafkaSender {
	private KafkaTemplate<String, String> kafkaTemplate;
	private RoutingKafkaTemplate routingKafkaTemplate;
	private KafkaTemplate<String, Shipment> shipmentKafkaTemplate;

	@Autowired
	KafkaSenderExample(KafkaTemplate<String, String> kafkaTemplate, RoutingKafkaTemplate routingKafkaTemplate,
			KafkaTemplate<String, User> shipmentKafkaTemplate) {
		this.kafkaTemplate = kafkaTemplate;
		this.routingKafkaTemplate = routingKafkaTemplate;
		this.shipmentKafkaTemplate = shipmentKafkaTemplate;
	}

	void sendMessage(String message, String topicName) {
		System.out.println("Sending MSG: " + message);
		System.out.println("--------------------------------");

		kafkaTemplate.send(topicName, message);
	}

	void sendCustomMessage(Shipment shipment, String topicName) {
    System.out.println("SENDING SHIPMENT: " + shipment.getName());
		System.out.println("--------------------------------");

		shipmentKafkaTemplate.send(topicName, shipment);
	}
}