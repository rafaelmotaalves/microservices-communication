package works.weave.socks.queuemaster.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import works.weave.socks.shipping.entities.Shipment;

@Component
@KafkaListener(id = "class-level", topics = "my-sample-topic-1, my-sample-topic-2")
class KafkaClassListener {
  @KafkaHandler
  void listen(Shipment shipment) {
		System.out.println("Received shipment task: " + shipment.getName());
  }

  @KafkaHandler(isDefault = true)
  void listenDefault(Object object) {
    LOG.info("KafkaHandler[Default] {}", object);
  }
}