package works.weave.socks.shipping.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import works.weave.socks.shipping.entities.HealthCheck;
import works.weave.socks.shipping.entities.Shipment;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class ShippingController {

    @Autowired
	  KafkaTemplate<String, String> shipmentKafkaTemplate;

    @RequestMapping(value = "/shipping", method = RequestMethod.GET)
    public String getShipping() {
        return "GET ALL Shipping Resource.";
    }

    @RequestMapping(value = "/shipping/{id}", method = RequestMethod.GET)
    public String getShippingById(@PathVariable String id) {
        return "GET Shipping Resource with id: " + id;
    }

    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping(value = "/shipping", method = RequestMethod.POST)
    public
    @ResponseBody
    Shipment postShipping(@RequestBody Shipment shipment) {
        System.out.println("Adding shipment to queue...");
        try {
            shipmentKafkaTemplate.send("shipping-task", shipment.toString());
            //rabbitTemplate.convertAndSend("shipping-task", shipment);
        } catch (Exception e) {
            System.out.println("Unable to add to queue (the queue is probably down). Accepting anyway. Don't do this " +
                    "for real!");
        }
        return shipment;
    }

    @ResponseStatus(HttpStatus.OK)
    @RequestMapping(method = RequestMethod.GET, path = "/health")
    public
    @ResponseBody
    Map<String, List<HealthCheck>> getHealth() {
        Map<String, List<HealthCheck>> map = new HashMap<String, List<HealthCheck>>();
        List<HealthCheck> healthChecks = new ArrayList<HealthCheck>();
        Date dateNow = Calendar.getInstance().getTime();

        HealthCheck app = new HealthCheck("shipping", "OK", dateNow);
        healthChecks.add(app);

        map.put("health", healthChecks);
        return map;
    }
}
