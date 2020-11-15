package works.weave.socks.queuemaster.configuration;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import works.weave.socks.shipping.entities.Shipment;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Configuration
class KafkaTopicConfig {

  @Bean
  public NewTopic topic1() {
    return TopicBuilder.name("my-sample-topic-1").build();
  }

  @Bean
  public NewTopic topic2() {
    return TopicBuilder.name("my-sample-topic-2").build();
  }
}