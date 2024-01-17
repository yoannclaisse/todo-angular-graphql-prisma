FROM rabbitmq:latest

RUN rabbitmq-plugins enable --offline rabbitmq_management && \
    rabbitmq-plugins enable --offline rabbitmq_stomp && \
    rabbitmq-plugins enable --offline rabbitmq_web_stomp && \
    rm -f /etc/rabbitmq/conf.d/20-management_agent.disable_metrics_collector.conf

EXPOSE 15672 15674 61613