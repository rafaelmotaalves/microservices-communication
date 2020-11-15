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
import works.weave.socks.shipping.entities.Shipment;


@Component
class KafkaSender {
	private KafkaTemplate<String, String> kafkaTemplate;
	private KafkaTemplate<String, Shipment> shipmentKafkaTemplate;

	@Autowired
	KafkaSender(KafkaTemplate<String, String> kafkaTemplate,
			KafkaTemplate<String, Shipment> shipmentKafkaTemplate) {
		this.kafkaTemplate = kafkaTemplate;
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