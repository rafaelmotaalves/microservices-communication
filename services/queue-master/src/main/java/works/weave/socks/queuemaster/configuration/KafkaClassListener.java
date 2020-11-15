package works.weave.socks.queuemaster.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import works.weave.socks.shipping.entities.Shipment;
import org.springframework.kafka.annotation.KafkaHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.config.KafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.listener.ConcurrentMessageListenerContainer;
import org.springframework.kafka.support.converter.StringJsonMessageConverter;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
@KafkaListener(id = "class-level", topics = "my-sample-topic-1, my-sample-topic-2")
class KafkaClassListener {
  private final Logger LOG = LoggerFactory.getLogger(getClass());

  @KafkaHandler
  void listen(Shipment shipment) {
		System.out.println("Received shipment task: " + shipment.getName());
  }

  @KafkaHandler(isDefault = true)
  void listenDefault(Object object) {
    LOG.info("KafkaHandler[Default] {}", object);
  }
}