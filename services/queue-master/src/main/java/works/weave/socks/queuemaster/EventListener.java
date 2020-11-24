package works.weave.socks.queuemaster;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class EventListener {
  private final Logger LOG = LoggerFactory.getLogger(getClass());

  @KafkaListener(topics = "shipping-task", groupId = "queuemaster-group")
  public void listen(ConsumerRecord<?, ?> cr) throws Exception {
    LOG.info(cr.toString());
  }
}
